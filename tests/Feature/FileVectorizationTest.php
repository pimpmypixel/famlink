<?php

use App\Models\TimelineItem;
use App\Models\User;
use App\Services\FileVectorizationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('file vectorization service processes PDF files', function () {
    $user = User::factory()->create();
    $timelineItem = TimelineItem::factory()->create(['user_id' => $user->id]);

    $vectorizationService = app(FileVectorizationService::class);

    // Create a mock PDF file
    $pdfContent = '%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Hello World) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000274 00000 n
0000000354 00000 n
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
459
%%EOF';

    // Create temporary file
    $tempFile = tempnam(sys_get_temp_dir(), 'test_pdf');
    file_put_contents($tempFile, $pdfContent);

    $attachment = [
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'original_name' => 'test_document.pdf',
        'filename' => 'test_document.pdf',
        'path' => 'timeline-items/' . $timelineItem->id . '/test_document.pdf',
        'url' => 'https://example.com/test_document.pdf',
        'mime_type' => 'application/pdf',
        'size' => strlen($pdfContent),
        'uploaded_at' => now()->toISOString(),
    ];

    // Mock S3 storage
    Storage::shouldReceive('disk')
        ->with('s3')
        ->andReturnSelf()
        ->shouldReceive('get')
        ->with($attachment['path'])
        ->andReturn($pdfContent);

    $result = $vectorizationService->processUploadedFile($attachment, $timelineItem);

    expect($result)->toBeTrue();

    unlink($tempFile);
});

test('file vectorization service processes Word documents', function () {
    $user = User::factory()->create();
    $timelineItem = TimelineItem::factory()->create(['user_id' => $user->id]);

    $vectorizationService = app(FileVectorizationService::class);

    // Create a simple text file to simulate Word content
    $wordContent = 'This is a test Word document content for vectorization testing.';

    $attachment = [
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'original_name' => 'test_document.docx',
        'filename' => 'test_document.docx',
        'path' => 'timeline-items/' . $timelineItem->id . '/test_document.docx',
        'url' => 'https://example.com/test_document.docx',
        'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'size' => strlen($wordContent),
        'uploaded_at' => now()->toISOString(),
    ];

    // Mock S3 storage
    Storage::shouldReceive('disk')
        ->with('s3')
        ->andReturnSelf()
        ->shouldReceive('get')
        ->with($attachment['path'])
        ->andReturn($wordContent);

    $result = $vectorizationService->processUploadedFile($attachment, $timelineItem);

    expect($result)->toBeTrue();
});

test('file vectorization service handles unsupported file types', function () {
    $user = User::factory()->create();
    $timelineItem = TimelineItem::factory()->create(['user_id' => $user->id]);

    $vectorizationService = app(FileVectorizationService::class);

    $attachment = [
        'id' => (string) \Illuminate\Support\Str::uuid(),
        'original_name' => 'test_image.png',
        'filename' => 'test_image.png',
        'path' => 'timeline-items/' . $timelineItem->id . '/test_image.png',
        'url' => 'https://example.com/test_image.png',
        'mime_type' => 'image/png',
        'size' => 1024,
        'uploaded_at' => now()->toISOString(),
    ];

    $result = $vectorizationService->processUploadedFile($attachment, $timelineItem);

    expect($result)->toBeFalse();
});

test('file vectorization service searches uploaded files', function () {
    $user = User::factory()->create();
    $vectorizationService = app(FileVectorizationService::class);

    // Mock the vector manager search method
    $mockResults = [
        [
            'content' => 'This is test content about custody arrangements',
            'score' => 0.85,
            'metadata' => [
                'file_name' => 'custody_agreement.pdf',
                'timeline_item_id' => (string) \Illuminate\Support\Str::uuid(),
                'user_id' => $user->id,
                'family_id' => $user->family_id,
            ]
        ]
    ];

    $vectorizationService->vectorManager = \Mockery::mock($vectorizationService->vectorManager);
    $vectorizationService->vectorManager
        ->shouldReceive('search')
        ->with('custody agreement', \Mockery::any())
        ->andReturn(collect($mockResults));

    $results = $vectorizationService->searchUploadedFiles('custody agreement');

    expect($results)->toBeArray();
    expect($results)->toHaveCount(1);
    expect($results[0]['file_name'])->toBe('custody_agreement.pdf');
});

test('file vectorization service generates file summaries', function () {
    $user = User::factory()->create();
    $timelineItem = TimelineItem::factory()->create(['user_id' => $user->id]);

    $vectorizationService = app(FileVectorizationService::class);

    $content = 'This is a sample document content for testing purposes.';
    $attachment = [
        'original_name' => 'sample.pdf',
        'size' => 1024,
    ];

    $summary = $vectorizationService->generateFileSummary($content, $attachment);

    expect($summary)->toContain('File: sample.pdf');
    expect($summary)->toContain('Size: 1.00 KB');
    expect($summary)->toContain('Words: 9');
    expect($summary)->toContain('Content Preview: This is a sample document');
});

test('file vectorization service chunks text content', function () {
    $vectorizationService = app(FileVectorizationService::class);

    $longText = str_repeat('This is a test sentence for chunking. ', 50);
    $chunks = $vectorizationService->chunkText($longText, 100, 20);

    expect($chunks)->toBeArray();
    expect($chunks)->toHaveCountGreaterThan(1);

    // Check that chunks are properly sized
    foreach ($chunks as $chunk) {
        expect(strlen($chunk))->toBeLessThanOrEqual(120); // chunk size + overlap
    }
});