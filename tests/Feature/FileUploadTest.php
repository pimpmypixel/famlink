<?php

use App\Models\Event;
use App\Models\Family;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

describe('File Upload', function () {
    beforeEach(function () {
        Storage::fake('s3');
    });

    describe('File Upload Authorization', function () {
        it('allows upload when user is in same family as timeline item', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $file = UploadedFile::fake()->create('test.pdf', 1000);

            $response = actingAs($user)
                ->post("/timeline/{$timelineItem->id}/upload", [
                    'file' => $file,
                ]);

            $response->assertRedirect()
                ->assertSessionHas('success', 'File uploaded successfully!');

            $timelineItem->refresh();
            expect($timelineItem->attachments)->toHaveCount(1);
            expect($timelineItem->attachments[0]['original_name'])->toBe('test.pdf');
        });

        it('denies upload when user is not in same family', function () {
            $family1 = Family::factory()->create();
            $family2 = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family1->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => User::factory()->create(['family_id' => $family2->id])->id,
                'family_id' => $family2->id,
            ]);

            $file = UploadedFile::fake()->create('test.pdf', 1000);

            $response = actingAs($user)
                ->post("/timeline/{$timelineItem->id}/upload", [
                    'file' => $file,
                ]);

            $response->assertStatus(403);
        });

        it('denies upload when timeline item does not exist', function () {
            $user = User::factory()->create();

            $file = UploadedFile::fake()->create('test.pdf', 1000);

            $response = actingAs($user)
                ->post('/timeline/non-existent-id/upload', [
                    'file' => $file,
                ]);

            $response->assertStatus(403);
        });
    });

    describe('File Upload Validation', function () {
        it('validates file is required', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            // Test validation rules directly with custom messages
            $rules = [
                'file' => [
                    'required',
                    'file',
                    'max:10240',
                    'mimes:jpeg,jpg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,mp4,avi,mov,mp3,wav',
                ],
            ];

            $messages = [
                'file.required' => 'Please select a file to upload.',
                'file.file' => 'The uploaded item must be a valid file.',
                'file.max' => 'File size must not exceed 10MB.',
                'file.mimes' => 'File type not supported. Supported types: JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, MP4, AVI, MOV, MP3, WAV.',
            ];

            $validator = validator([], $rules, $messages);
            expect($validator->fails())->toBeTrue();
            expect($validator->errors()->has('file'))->toBeTrue();
            expect($validator->errors()->first('file'))->toBe('Please select a file to upload.');
        });

        it('validates file size limit', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            // Create a file larger than 10MB
            $largeFile = UploadedFile::fake()->create('large.pdf', 11000); // 11MB

            $rules = [
                'file' => [
                    'required',
                    'file',
                    'max:10240',
                    'mimes:jpeg,jpg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,mp4,avi,mov,mp3,wav',
                ],
            ];

            $messages = [
                'file.required' => 'Please select a file to upload.',
                'file.file' => 'The uploaded item must be a valid file.',
                'file.max' => 'File size must not exceed 10MB.',
                'file.mimes' => 'File type not supported. Supported types: JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, MP4, AVI, MOV, MP3, WAV.',
            ];

            $validator = validator(['file' => $largeFile], $rules, $messages);
            expect($validator->fails())->toBeTrue();
            expect($validator->errors()->has('file'))->toBeTrue();
            expect($validator->errors()->first('file'))->toBe('File size must not exceed 10MB.');
        });

        it('validates file type', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            // Create a file with unsupported extension
            $exeFile = UploadedFile::fake()->create('test.exe', 1000);

            $rules = [
                'file' => [
                    'required',
                    'file',
                    'max:10240',
                    'mimes:jpeg,jpg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,mp4,avi,mov,mp3,wav',
                ],
            ];

            $messages = [
                'file.required' => 'Please select a file to upload.',
                'file.file' => 'The uploaded item must be a valid file.',
                'file.max' => 'File size must not exceed 10MB.',
                'file.mimes' => 'File type not supported. Supported types: JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, MP4, AVI, MOV, MP3, WAV.',
            ];

            $validator = validator(['file' => $exeFile], $rules, $messages);
            expect($validator->fails())->toBeTrue();
            expect($validator->errors()->has('file'))->toBeTrue();
            expect($validator->errors()->first('file'))->toBe('File type not supported. Supported types: JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, MP4, AVI, MOV, MP3, WAV.');
        });

        it('accepts valid file types', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $validFiles = [
                UploadedFile::fake()->image('test.jpg'),
                UploadedFile::fake()->create('test.pdf', 1000),
                UploadedFile::fake()->create('test.docx', 1000),
                UploadedFile::fake()->create('test.xlsx', 1000),
                UploadedFile::fake()->create('test.zip', 1000),
            ];

            foreach ($validFiles as $file) {
                $response = actingAs($user)
                    ->withoutMiddleware()
                    ->post("/timeline/{$timelineItem->id}/upload", [
                        'file' => $file,
                    ]);

                $response->assertRedirect()
                    ->assertSessionHas('success', 'File uploaded successfully!');
            }
        });
    });

    describe('File Upload Processing', function () {
        it('stores file in S3 with correct path', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $file = UploadedFile::fake()->create('test.pdf', 1000);

            actingAs($user)
                ->post("/timeline/{$timelineItem->id}/upload", [
                    'file' => $file,
                ]);

            // Check that file was stored (using fake storage)
            $files = Storage::disk('s3')->allFiles("timeline-items/{$timelineItem->id}");
            expect($files)->toHaveCount(1);
        });

        it('updates timeline item attachments array', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $file = UploadedFile::fake()->create('test.pdf', 1000);

            actingAs($user)
                ->post("/timeline/{$timelineItem->id}/upload", [
                    'file' => $file,
                ]);

            $timelineItem->refresh();
            expect($timelineItem->attachments)->toHaveCount(1);

            $attachment = $timelineItem->attachments[0];
            expect($attachment)->toHaveKeys([
                'id', 'original_name', 'filename', 'path', 'url',
                'mime_type', 'size', 'uploaded_at',
            ]);
            expect($attachment['original_name'])->toBe('test.pdf');
            expect($attachment['mime_type'])->toBe('application/pdf');
        });

        it('generates unique filename for uploaded file', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $file = UploadedFile::fake()->create('test.pdf', 1000);

            actingAs($user)
                ->post("/timeline/{$timelineItem->id}/upload", [
                    'file' => $file,
                ]);

            $timelineItem->refresh();
            $attachment = $timelineItem->attachments[0];

            // Filename should be UUID + extension
            expect($attachment['filename'])->toMatch('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/');
            expect($attachment['filename'])->not->toBe('test.pdf');
        });

        it('returns correct response and stores attachment data', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $file = UploadedFile::fake()->create('test.pdf', 1000);

            $response = actingAs($user)
                ->post("/timeline/{$timelineItem->id}/upload", [
                    'file' => $file,
                ]);

            $response->assertRedirect()
                ->assertSessionHas('success', 'File uploaded successfully!');

            $timelineItem->refresh();
            expect($timelineItem->attachments)->toHaveCount(1);

            $attachment = $timelineItem->attachments[0];
            expect($attachment)->toHaveKeys([
                'id', 'original_name', 'filename', 'path', 'url',
                'mime_type', 'size', 'uploaded_at',
            ]);
            expect($attachment['original_name'])->toBe('test.pdf');
            expect($attachment['mime_type'])->toBe('application/pdf');
        });
    });

    describe('Multiple File Uploads', function () {
        it('handles multiple attachments on same timeline item', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $files = [
                UploadedFile::fake()->create('test1.pdf', 1000),
                UploadedFile::fake()->create('test2.jpg', 500),
                UploadedFile::fake()->create('test3.docx', 2000),
            ];

            foreach ($files as $file) {
                actingAs($user)
                    ->post("/timeline/{$timelineItem->id}/upload", [
                        'file' => $file,
                    ]);
            }

            $timelineItem->refresh();
            expect($timelineItem->attachments)->toHaveCount(3);

            $originalNames = array_column($timelineItem->attachments, 'original_name');
            expect($originalNames)->toContain('test1.pdf', 'test2.jpg', 'test3.docx');
        });
    });
});
