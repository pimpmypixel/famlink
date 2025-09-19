<?php

namespace App\Tools;

use App\Services\FileVectorizationService;
use Vizra\VizraADK\Contracts\ToolInterface;
use Vizra\VizraADK\Memory\AgentMemory;
use Vizra\VizraADK\System\AgentContext;

class FileSearchTool implements ToolInterface
{
    public function __construct(
        private FileVectorizationService $vectorizationService
    ) {}

    /**
     * Get the tool's definition for the LLM.
     * This structure should be JSON schema compatible.
     */
    public function definition(): array
    {
        return [
            'name' => 'file_search',
            'description' => 'Search through uploaded files using semantic similarity. Useful for finding relevant documents, legal papers, or communications related to specific topics.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'query' => [
                        'type' => 'string',
                        'description' => 'The search query to find semantically similar content in uploaded files.'
                    ],
                    'family_id' => [
                        'type' => 'string',
                        'description' => 'Optional: Limit search to files from a specific family (UUID).'
                    ],
                    'limit' => [
                        'type' => 'integer',
                        'description' => 'Optional: Maximum number of results to return (default: 10).',
                        'default' => 10
                    ],
                    'threshold' => [
                        'type' => 'number',
                        'description' => 'Optional: Similarity threshold (0.0-1.0) for filtering results (default: 0.7).',
                        'default' => 0.7
                    ]
                ],
                'required' => ['query'],
            ],
        ];
    }

    /**
     * Execute the tool's logic.
     *
     * @param array $arguments Arguments provided by the LLM, matching the parameters defined above.
     * @param AgentContext $context The current agent context, providing access to session state etc.
     * @return string JSON string representation of the tool's result.
     */
    public function execute(array $arguments, AgentContext $context, AgentMemory $memory): string
    {
        try {
            $query = $arguments['query'];
            $familyId = $arguments['family_id'] ?? null;
            $limit = $arguments['limit'] ?? 10;
            $threshold = $arguments['threshold'] ?? 0.7;

            // Perform semantic search using the vectorization service
            $results = $this->vectorizationService->searchUploadedFiles(
                query: $query,
                familyId: $familyId,
                limit: $limit,
                threshold: $threshold
            );

            $result = [
                'status' => 'success',
                'query' => $query,
                'results_count' => count($results),
                'results' => $results,
                'search_parameters' => [
                    'family_id' => $familyId,
                    'limit' => $limit,
                    'threshold' => $threshold
                ]
            ];

        } catch (\Exception $e) {
            $result = [
                'status' => 'error',
                'message' => 'Failed to search uploaded files: ' . $e->getMessage(),
                'query' => $query ?? null
            ];
        }

        return json_encode($result);
    }
}
