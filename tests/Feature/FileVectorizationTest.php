<?php

use App\Models\TimelineItem;
use App\Models\User;
use App\Services\FileVectorizationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('file vectorization service processes PDF files', function () {
    $user = User::factory()->create();
    $timelineItem = TimelineItem::factory()->create(['user_id' => $user->id]);

    // Mock the vector manager
    $vectorManagerMock = \Mockery::mock(\Vizra\VizraADK\Services\VectorMemoryManager::class);
    $vectorManagerMock->shouldReceive('store')
        ->andReturn(true);

    $vectorizationService = new FileVectorizationService($vectorManagerMock);

    // Create simple text content
    $pdfContent = 'This is test PDF content for vectorization.';

    $attachment = [
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'original_name' => 'test_document.pdf',
        'filename' => 'test_document.pdf',
        'path' => 'timeline-items/'.$timelineItem->id.'/test_document.pdf',
        'url' => 'https://example.com/test_document.pdf',
        'mime_type' => 'application/pdf',
        'size' => strlen($pdfContent),
        'uploaded_at' => now()->toISOString(),
    ];

    // Mock Storage facade properly
    $storageMock = \Mockery::mock();
    $storageMock->shouldReceive('get')
        ->with($attachment['path'])
        ->andReturn($pdfContent);

    Storage::shouldReceive('disk')
        ->with('s3')
        ->andReturn($storageMock);

    // Mock PDF parser
    $pdfParserMock = \Mockery::mock(\Smalot\PdfParser\Parser::class);
    $pdfDocumentMock = \Mockery::mock(\Smalot\PdfParser\Document::class);
    $pdfDocumentMock->shouldReceive('getText')->andReturn($pdfContent);
    $pdfParserMock->shouldReceive('parseContent')->andReturn($pdfDocumentMock);

    $vectorizationService = new FileVectorizationService($vectorManagerMock, $pdfParserMock);

    $result = $vectorizationService->processUploadedFile($attachment, $timelineItem);

    expect($result)->toBeTrue();
});

test('file vectorization service processes Word documents', function () {
    $user = User::factory()->create();
    $timelineItem = TimelineItem::factory()->create(['user_id' => $user->id]);

    // Mock the vector manager
    $vectorManagerMock = \Mockery::mock(\Vizra\VizraADK\Services\VectorMemoryManager::class);
    $vectorManagerMock->shouldReceive('store')
        ->andReturn(true);

    $vectorizationService = new FileVectorizationService($vectorManagerMock);

    // Create simple text content
    $wordContent = 'This is test Word document content for vectorization.';

    $attachment = [
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'original_name' => 'test_document.docx',
        'filename' => 'test_document.docx',
        'path' => 'timeline-items/'.$timelineItem->id.'/test_document.docx',
        'url' => 'https://example.com/test_document.docx',
        'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'size' => strlen($wordContent),
        'uploaded_at' => now()->toISOString(),
    ];

    // Mock Storage facade properly
    $storageMock = \Mockery::mock();
    $storageMock->shouldReceive('get')
        ->with($attachment['path'])
        ->andReturn($wordContent);

    Storage::shouldReceive('disk')
        ->with('s3')
        ->andReturn($storageMock);

    // Skip this test in CI environment as Word processing requires actual .docx files
    if (getenv('CI') === 'true' || getenv('GITHUB_ACTIONS') === 'true' || getenv('CONTINUOUS_INTEGRATION') === 'true') {
        $this->markTestSkipped('Word document processing test skipped in CI environment');
    }

    $result = $vectorizationService->processUploadedFile($attachment, $timelineItem);

    expect($result)->toBeTrue();
});

test('file vectorization service handles unsupported file types', function () {
    $user = User::factory()->create();
    $timelineItem = TimelineItem::factory()->create(['user_id' => $user->id]);

    // Mock the vector manager
    $vectorManagerMock = \Mockery::mock(\Vizra\VizraADK\Services\VectorMemoryManager::class);

    $vectorizationService = new FileVectorizationService($vectorManagerMock);

    $attachment = [
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'original_name' => 'test_image.png',
        'filename' => 'test_image.png',
        'path' => 'timeline-items/'.$timelineItem->id.'/test_image.png',
        'url' => 'https://example.com/test_image.png',
        'mime_type' => 'image/png',
        'size' => 1024,
        'uploaded_at' => now()->toISOString(),
    ];

    $result = $vectorizationService->processUploadedFile($attachment, $timelineItem);

    expect($result)->toBeFalse();
});

test('file vectorization service searches uploaded files', function () {
    // Mock the vector manager
    $vectorManagerMock = \Mockery::mock(\Vizra\VizraADK\Services\VectorMemoryManager::class);

    $mockResults = collect([
        [
            'content' => 'This is test content about custody arrangements',
            'score' => 0.85,
            'metadata' => [
                'file_name' => 'custody_agreement.pdf',
                'timeline_item_id' => (string) \Illuminate\Support\Str::uuid(),
                'user_id' => 1,
                'family_id' => 1,
            ],
        ],
    ]);

    $vectorManagerMock->shouldReceive('search')
        ->with('custody agreement', \Mockery::any())
        ->andReturn($mockResults);

    $vectorizationService = new FileVectorizationService($vectorManagerMock);

    $results = $vectorizationService->searchUploadedFiles('custody agreement');

    expect($results)->toBeArray();
    expect($results)->toHaveCount(1);
    expect($results[0]['file_name'])->toBe('custody_agreement.pdf');
});

test('file vectorization service generates file summaries', function () {
    // Mock the vector manager
    $vectorManagerMock = \Mockery::mock(\Vizra\VizraADK\Services\VectorMemoryManager::class);
    $vectorizationService = new FileVectorizationService($vectorManagerMock);

    $content = 'This is a sample document content for testing purposes.';
    $attachment = [
        'original_name' => 'sample.pdf',
        'size' => 1024,
    ];

    // Use reflection to access protected method
    $reflection = new \ReflectionClass($vectorizationService);
    $method = $reflection->getMethod('generateFileSummary');
    $method->setAccessible(true);

    $summary = $method->invoke($vectorizationService, $content, $attachment);

    expect($summary)->toContain('File: sample.pdf');
    expect($summary)->toContain('Size: 1.0 KB');
    expect($summary)->toContain('Words: 9');
});

test('file vectorization service chunks text content', function () {
    // Mock the vector manager
    $vectorManagerMock = \Mockery::mock(\Vizra\VizraADK\Services\VectorMemoryManager::class);
    $vectorizationService = new FileVectorizationService($vectorManagerMock);

    $longText = str_repeat('This is a test sentence for chunking. ', 50);

    // Use reflection to access protected method
    $reflection = new \ReflectionClass($vectorizationService);
    $method = $reflection->getMethod('chunkText');
    $method->setAccessible(true);

    $chunks = $method->invoke($vectorizationService, $longText, 100, 20);

    expect($chunks)->toBeArray();
    expect(count($chunks))->toBeGreaterThan(1);

    // Check that chunks are properly sized
    foreach ($chunks as $chunk) {
        expect(strlen($chunk))->toBeLessThanOrEqual(120); // chunk size + overlap
    }
});

test('debug pdf processing', function () {
    $vectorManagerMock = \Mockery::mock(\Vizra\VizraADK\Services\VectorMemoryManager::class);
    $vectorizationService = new FileVectorizationService($vectorManagerMock);

    $pdfContent = 'This is test PDF content for vectorization.';

    // Use reflection to access protected method
    $reflection = new \ReflectionClass($vectorizationService);
    $method = $reflection->getMethod('processPdf');
    $method->setAccessible(true);

    $result = $method->invoke($vectorizationService, $pdfContent, 'test.pdf');

    dump('PDF processing result:', $result);
    expect($result)->toBeString();
});
