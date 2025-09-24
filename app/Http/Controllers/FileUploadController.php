<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteAttachmentRequest;
use App\Http\Requests\FileUploadRequest;
use App\Models\Event;
use App\Services\FileVectorizationService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    public function __construct(
        private FileVectorizationService $vectorizationService
    ) {}

    public function upload(FileUploadRequest $request, string $eventId)
    {
        $timelineItem = Event::findOrFail($eventId);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();

        // Generate unique filename
        $filename = Str::uuid().'.'.$extension;

        // Upload to S3 under timeline item folder
        $path = $file->storeAs(
            "timeline-items/{$eventId}",
            $filename,
            's3'
        );

        if (! $path) {
            return back()->withErrors(['file' => 'Failed to upload file. Please try again.']);
        }

        // Get file URL - construct manually since some S3 drivers don't have url() method
        $bucket = config('filesystems.disks.s3.bucket');
        $region = config('filesystems.disks.s3.region', 'us-east-1');
        $url = "https://{$bucket}.s3.{$region}.amazonaws.com/{$path}";

        // Prepare attachment data
        $attachment = [
            'id' => Str::uuid(),
            'original_name' => $originalName,
            'filename' => $filename,
            'path' => $path,
            'url' => $url,
            'mime_type' => $mimeType,
            'size' => $file->getSize(),
            'uploaded_at' => now()->toISOString(),
        ];

        // Update timeline item attachments
        $attachments = $timelineItem->attachments ?? [];
        $attachments[] = $attachment;
        $timelineItem->update(['attachments' => $attachments]);

        // Process file for vectorization (async/background processing)
        try {
            $this->vectorizationService->processUploadedFile($attachment, $timelineItem);
        } catch (\Exception $e) {
            // Log error but don't fail the upload
            \Illuminate\Support\Facades\Log::error('File vectorization failed', [
                'file' => $originalName,
                'timeline_item_id' => $eventId,
                'error' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'File uploaded successfully!');
    }

    public function delete(DeleteAttachmentRequest $request, string $eventId, string $attachmentId)
    {
        $timelineItem = Event::findOrFail($eventId);

        $attachments = $timelineItem->attachments ?? [];
        $attachmentIndex = collect($attachments)->search(function ($attachment) use ($attachmentId) {
            return $attachment['id'] === $attachmentId;
        });

        if ($attachmentIndex === false) {
            return back()->withErrors(['attachment' => 'Attachment not found.']);
        }

        $attachment = $attachments[$attachmentIndex];

        // Delete from S3
        Storage::disk('s3')->delete($attachment['path']);

        // Remove from attachments array
        unset($attachments[$attachmentIndex]);
        $timelineItem->update(['attachments' => array_values($attachments)]);

        return back()->with('success', 'Attachment deleted successfully!');
    }
}
