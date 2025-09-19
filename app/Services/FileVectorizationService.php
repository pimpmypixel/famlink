<?php

namespace App\Services;

use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;
use PhpOffice\PhpSpreadsheet\IOFactory as SpreadsheetIOFactory;
use Vizra\VizraADK\Services\VectorMemoryManager;

class FileVectorizationService
{
    protected VectorMemoryManager $vectorManager;
    protected array $supportedTypes = [
        'pdf' => 'processPdf',
        'doc' => 'processWord',
        'docx' => 'processWord',
        'xls' => 'processSpreadsheet',
        'xlsx' => 'processSpreadsheet',
        'txt' => 'processText',
        'md' => 'processText',
    ];

    public function __construct(VectorMemoryManager $vectorManager)
    {
        $this->vectorManager = $vectorManager;
    }

    /**
     * Process an uploaded file and create vector embeddings for semantic search
     */
    public function processUploadedFile(array $attachment, TimelineItem $timelineItem): bool
    {
        try {
            $filePath = $attachment['path'];
            $mimeType = $attachment['mime_type'];
            $originalName = $attachment['original_name'];

            // Determine file type from extension
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

            if (!isset($this->supportedTypes[$extension])) {
                Log::info("Unsupported file type for vectorization: {$extension}");
                return false;
            }

            // Download file from S3
            $fileContent = Storage::disk('s3')->get($filePath);
            if (!$fileContent) {
                Log::error("Could not retrieve file from S3: {$filePath}");
                return false;
            }

            // Extract text content based on file type
            $textContent = $this->{$this->supportedTypes[$extension]}($fileContent, $originalName);

            if (empty($textContent)) {
                Log::warning("No text content extracted from file: {$originalName}");
                return false;
            }

            // Create vector embeddings for the content
            $this->createVectorEmbeddings($textContent, $attachment, $timelineItem);

            Log::info("Successfully processed file for vectorization: {$originalName}");
            return true;

        } catch (\Exception $e) {
            Log::error("Error processing file for vectorization: {$e->getMessage()}", [
                'file' => $attachment['original_name'],
                'timeline_item_id' => $timelineItem->id,
                'error' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Process PDF files
     */
    protected function processPdf(string $content, string $filename): string
    {
        try {
            $pdfParser = new PdfParser();
            $pdf = $pdfParser->parseContent($content);
            return $pdf->getText();
        } catch (\Exception $e) {
            Log::warning("Error parsing PDF {$filename}: {$e->getMessage()}");
            return '';
        }
    }

    /**
     * Process Word documents
     */
    protected function processWord(string $content, string $filename): string
    {
        try {
            // Save content to temporary file for processing
            $tempFile = tempnam(sys_get_temp_dir(), 'word_') . '.docx';
            file_put_contents($tempFile, $content);

            $phpWord = WordIOFactory::load($tempFile);
            $text = '';

            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    if (method_exists($element, 'getText')) {
                        $text .= $element->getText() . ' ';
                    }
                }
            }

            unlink($tempFile);
            return trim($text);
        } catch (\Exception $e) {
            Log::warning("Error parsing Word document {$filename}: {$e->getMessage()}");
            return '';
        }
    }

    /**
     * Process spreadsheet files
     */
    protected function processSpreadsheet(string $content, string $filename): string
    {
        try {
            // Save content to temporary file for processing
            $tempFile = tempnam(sys_get_temp_dir(), 'spreadsheet_') . '.xlsx';
            file_put_contents($tempFile, $content);

            $spreadsheet = SpreadsheetIOFactory::load($tempFile);
            $text = '';

            foreach ($spreadsheet->getAllSheets() as $sheet) {
                foreach ($sheet->getRowIterator() as $row) {
                    foreach ($row->getCellIterator() as $cell) {
                        $text .= $cell->getValue() . ' ';
                    }
                    $text .= "\n";
                }
            }

            unlink($tempFile);
            return trim($text);
        } catch (\Exception $e) {
            Log::warning("Error parsing spreadsheet {$filename}: {$e->getMessage()}");
            return '';
        }
    }

    /**
     * Process text files
     */
    protected function processText(string $content, string $filename): string
    {
        // For text files, content is already text
        return $content;
    }

    /**
     * Create vector embeddings for the extracted text content
     */
    protected function createVectorEmbeddings(string $textContent, array $attachment, TimelineItem $timelineItem): void
    {
        $user = $timelineItem->user;
        $agentName = "user_{$user->id}_file_processor";

        // Chunk the content for better vectorization
        $chunks = $this->chunkText($textContent);

        foreach ($chunks as $index => $chunk) {
            $metadata = [
                'timeline_item_id' => $timelineItem->id,
                'user_id' => $user->id,
                'family_id' => $timelineItem->family_id,
                'file_name' => $attachment['original_name'],
                'file_path' => $attachment['path'],
                'file_type' => $attachment['mime_type'],
                'file_size' => $attachment['size'],
                'chunk_index' => $index,
                'total_chunks' => count($chunks),
                'uploaded_at' => $attachment['uploaded_at'],
                'source_type' => 'uploaded_file',
            ];

            // Store in vector memory using correct API
            $this->vectorManager->store(
                $chunk,
                $metadata
            );
        }

        // Also store a summary entry for the entire file
        $summary = $this->generateFileSummary($textContent, $attachment);
        $this->vectorManager->store(
            $summary,
            array_merge($metadata, ['chunk_index' => -1, 'is_summary' => true])
        );
    }

    /**
     * Chunk text content for optimal vectorization
     */
    protected function chunkText(string $text, int $chunkSize = 1000, int $overlap = 200): array
    {
        $chunks = [];
        $words = explode(' ', $text);
        $currentChunk = '';
        $wordCount = 0;

        foreach ($words as $word) {
            $currentChunk .= $word . ' ';
            $wordCount++;

            if (strlen($currentChunk) >= $chunkSize) {
                $chunks[] = trim($currentChunk);

                // Start new chunk with overlap
                $overlapWords = array_slice($words, max(0, count($words) - $wordCount), $overlap);
                $currentChunk = implode(' ', $overlapWords) . ' ';
                $wordCount = count($overlapWords);
            }
        }

        // Add remaining content
        if (!empty(trim($currentChunk))) {
            $chunks[] = trim($currentChunk);
        }

        return $chunks;
    }

    /**
     * Generate a summary of the file content
     */
    protected function generateFileSummary(string $content, array $attachment): string
    {
        $wordCount = str_word_count($content);
        $charCount = strlen($content);
        $filename = $attachment['original_name'];

        return "File: {$filename}\n" .
               "Size: " . number_format($attachment['size'] / 1024, 1) . " KB\n" .
               "Words: {$wordCount}\n" .
               "Characters: {$charCount}\n" .
               "Content Preview: " . substr($content, 0, 500) . (strlen($content) > 500 ? '...' : '');
    }

    /**
     * Search for semantically similar content in uploaded files
     */
    public function searchUploadedFiles(
        string $query,
        ?string $familyId = null,
        int $limit = 10,
        float $threshold = 0.7
    ): array {
        try {
            // Build search filters
            $filters = [
                'source_type' => 'uploaded_file',
                'limit' => $limit,
                'threshold' => $threshold,
            ];

            if ($familyId) {
                $filters['family_id'] = $familyId;
            }

            $results = $this->vectorManager->search($query, $filters);

            // Format results for the tool
            $formattedResults = [];
            foreach ($results as $result) {
                $metadata = $result['metadata'] ?? [];

                $formattedResults[] = [
                    'file_name' => $metadata['file_name'] ?? 'Unknown',
                    'file_path' => $metadata['file_path'] ?? '',
                    'timeline_item_id' => $metadata['timeline_item_id'] ?? '',
                    'similarity_score' => $result['score'] ?? 0,
                    'content_preview' => substr($result['content'] ?? '', 0, 300),
                    'uploaded_at' => $metadata['uploaded_at'] ?? '',
                    'chunk_info' => [
                        'index' => $metadata['chunk_index'] ?? 0,
                        'total' => $metadata['total_chunks'] ?? 1,
                        'is_summary' => $metadata['is_summary'] ?? false,
                    ],
                    'metadata' => $metadata,
                ];
            }

            return $formattedResults;

        } catch (\Exception $e) {
            Log::error("Error searching uploaded files: {$e->getMessage()}", [
                'query' => $query,
                'family_id' => $familyId,
                'error' => $e->getTraceAsString()
            ]);
            return [];
        }
    }

    /**
     * Get all uploaded files for a user
     */
    public function getUserFiles(User $user): array
    {
        try {
            $results = $this->vectorManager->search('', [
                'source_type' => 'uploaded_file',
                'user_id' => $user->id,
                'limit' => 100,
            ]);

            return $results->toArray();
        } catch (\Exception $e) {
            Log::error("Error getting user files: {$e->getMessage()}", [
                'user_id' => $user->id,
                'error' => $e->getTraceAsString()
            ]);
            return [];
        }
    }
}
