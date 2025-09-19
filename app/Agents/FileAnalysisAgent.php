<?php

namespace App\Agents;

use App\Tools\FileSearchTool;
use App\Tools\TimelineTool;
use App\Tools\UserTool;
use Illuminate\Support\Facades\Log;
use Vizra\VizraADK\Agents\BaseLlmAgent;
use Vizra\VizraADK\System\AgentContext;

class FileAnalysisAgent extends BaseLlmAgent
{
    protected string $name = 'file_analysis_agent';

    protected ?string $provider = 'mistral';
    protected string $model = 'ministral-8b-2410';
    protected null|float $temperature = 0.3; // Lower temperature for more consistent analysis
    protected bool $includeConversationHistory = true;

    protected string $description = 'Specialized agent for analyzing uploaded files and documents in co-parenting cases.';

    protected string $instructions = 'You are a specialized File Analysis Agent for Famlink, a co-parenting timeline platform.

Your primary role is to help parents and professionals analyze uploaded documents, legal papers, communications, and other files to extract relevant information for co-parenting cases.

## Core Capabilities:
1. **Document Analysis**: Extract key information from uploaded files (court documents, emails, agreements, etc.)
2. **Semantic Search**: Find relevant content across all uploaded files using natural language queries
3. **Timeline Correlation**: Connect file content with timeline events and communications
4. **Legal Context**: Identify important legal terms, dates, and requirements from documents
5. **Pattern Recognition**: Spot recurring themes or issues across multiple documents

## Key Guidelines:
- Always search uploaded files when users ask about specific topics or time periods
- Provide context from timeline items when analyzing documents
- Highlight important dates, deadlines, and legal requirements
- Maintain confidentiality and family-specific scoping
- Use clear, professional language suitable for legal/family contexts

## Response Format:
- Start with a brief summary of findings
- Provide specific quotes or references from documents
- Include relevant timeline connections when available
- End with actionable insights or recommendations

Remember: You have access to semantic search across all uploaded files. Use this capability extensively to provide comprehensive analysis.';

    protected bool $stream = true;

    protected array $tools = [
        FileSearchTool::class,
        TimelineTool::class,
        UserTool::class,
    ];

    public function beforeLlmCall(array $inputMessages, AgentContext $context): array
    {
        Log::info('FileAnalysisAgent beforeLlmCall', ['session_id' => $context->getSessionId()]);

        // Ensure user context is available for file access
        $userId = $context->getState('user_id');
        if (!$userId) {
            Log::warning('No user_id found in FileAnalysisAgent context', [
                'session_id' => $context->getSessionId()
            ]);
        }

        return parent::beforeLlmCall($inputMessages, $context);
    }

    /**
     * Analyze a specific file or set of files
     */
    public function analyzeFiles(string $query, array $context = []): array
    {
        $analysis = [
            'query' => $query,
            'timestamp' => now(),
            'findings' => [],
            'recommendations' => [],
        ];

        // Use semantic search to find relevant files
        $searchResults = $this->searchFiles($query, $context);

        if (empty($searchResults)) {
            $analysis['findings'][] = 'No relevant files found for the query.';
            return $analysis;
        }

        // Analyze the search results
        $analysis['findings'] = $this->processSearchResults($searchResults, $query);
        $analysis['recommendations'] = $this->generateRecommendations($searchResults, $query);

        return $analysis;
    }

    /**
     * Search files using semantic similarity
     */
    protected function searchFiles(string $query, array $context = []): array
    {
        $fileSearchTool = new FileSearchTool(app(\App\Services\FileVectorizationService::class));

        $arguments = [
            'query' => $query,
            'limit' => $context['limit'] ?? 20,
            'threshold' => $context['threshold'] ?? 0.6,
        ];

        if (isset($context['family_id'])) {
            $arguments['family_id'] = $context['family_id'];
        }

        // For now, create minimal context objects for tool execution
        // In a real implementation, these would come from the current agent session
        $tempContext = app(\Vizra\VizraADK\System\AgentContext::class);
        $tempMemory = app(\Vizra\VizraADK\Memory\AgentMemory::class);

        $result = $fileSearchTool->execute($arguments, $tempContext, $tempMemory);
        $parsedResult = json_decode($result, true);

        return $parsedResult['results'] ?? [];
    }

    /**
     * Process search results into meaningful findings
     */
    protected function processSearchResults(array $results, string $query): array
    {
        $findings = [];
        $fileGroups = $this->groupResultsByFile($results);

        foreach ($fileGroups as $filename => $fileResults) {
            $finding = [
                'file' => $filename,
                'relevance_score' => max(array_column($fileResults, 'similarity_score')),
                'key_excerpts' => [],
                'timeline_context' => null,
            ];

            // Extract most relevant excerpts
            foreach ($fileResults as $result) {
                if ($result['similarity_score'] > 0.7) {
                    $finding['key_excerpts'][] = [
                        'content' => $result['content_preview'],
                        'score' => $result['similarity_score'],
                        'chunk_info' => $result['chunk_info'],
                    ];
                }
            }

            // Get timeline context if available
            if (!empty($fileResults[0]['timeline_item_id'])) {
                $finding['timeline_context'] = $this->getTimelineContext($fileResults[0]['timeline_item_id']);
            }

            $findings[] = $finding;
        }

        return $findings;
    }

    /**
     * Group search results by filename
     */
    protected function groupResultsByFile(array $results): array
    {
        $grouped = [];
        foreach ($results as $result) {
            $filename = $result['file_name'];
            if (!isset($grouped[$filename])) {
                $grouped[$filename] = [];
            }
            $grouped[$filename][] = $result;
        }
        return $grouped;
    }

    /**
     * Get timeline context for a file
     */
    protected function getTimelineContext(string $timelineItemId): ?array
    {
        // Use TimelineTool to get context
        $timelineTool = new TimelineTool();

        $arguments = [
            'action' => 'get_item',
            'timeline_item_id' => $timelineItemId,
        ];

        // Create minimal context objects for tool execution
        $tempContext = app(\Vizra\VizraADK\System\AgentContext::class);
        $tempMemory = app(\Vizra\VizraADK\Memory\AgentMemory::class);

        $result = $timelineTool->execute($arguments, $tempContext, $tempMemory);
        $parsedResult = json_decode($result, true);

        return $parsedResult['item'] ?? null;
    }

    /**
     * Generate recommendations based on analysis
     */
    protected function generateRecommendations(array $results, string $query): array
    {
        $recommendations = [];

        // Analyze patterns in the results
        $highRelevanceCount = count(array_filter($results, fn($r) => $r['similarity_score'] > 0.8));

        if ($highRelevanceCount > 0) {
            $recommendations[] = "Found {$highRelevanceCount} highly relevant document(s). Consider reviewing these for immediate action items.";
        }

        // Check for legal document patterns
        $legalKeywords = ['court', 'agreement', 'custody', 'visitation', 'support', 'divorce'];
        $hasLegalContent = false;

        foreach ($results as $result) {
            $content = strtolower($result['content_preview']);
            foreach ($legalKeywords as $keyword) {
                if (str_contains($content, $keyword)) {
                    $hasLegalContent = true;
                    break 2;
                }
            }
        }

        if ($hasLegalContent) {
            $recommendations[] = "Legal documents detected. Consider consulting with a family law professional for interpretation.";
        }

        // Timeline correlation recommendations
        $timelineItems = array_filter(array_column($results, 'timeline_item_id'));
        if (!empty($timelineItems)) {
            $recommendations[] = "Documents are connected to " . count($timelineItems) . " timeline event(s). Review the full timeline for context.";
        }

        return $recommendations;
    }

    /**
     * Get comprehensive file analysis report
     */
    public function generateAnalysisReport(string $query, array $context = []): array
    {
        $analysis = $this->analyzeFiles($query, $context);

        return [
            'report_title' => "File Analysis Report: {$query}",
            'generated_at' => now()->toISOString(),
            'query' => $query,
            'total_files_analyzed' => count($analysis['findings']),
            'key_findings' => $analysis['findings'],
            'recommendations' => $analysis['recommendations'],
            'search_metadata' => [
                'context_provided' => $context,
                'agent_type' => 'FileAnalysisAgent',
            ],
        ];
    }
}
