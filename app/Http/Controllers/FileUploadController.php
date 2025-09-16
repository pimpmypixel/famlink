<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteAttachmentRequest;
use App\Http\Requests\FileUploadRequest;
use App\Models\TimelineItem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadController extends Controller
{
    public function upload(FileUploadRequest $request, string $timelineItemId)
    {
        $timelineItem = TimelineItem::findOrFail($timelineItemId);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();

        // Generate unique filename
        $filename = Str::uuid().'.'.$extension;

        // Upload to S3 under timeline item folder
        $path = $file->storeAs(
            "timeline-items/{$timelineItemId}",
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

        // Update timeline item attachments
        $attachments = $timelineItem->attachments ?? [];
        $attachments[] = [
            'id' => Str::uuid(),
            'original_name' => $originalName,
            'filename' => $filename,
            'path' => $path,
            'url' => $url,
            'mime_type' => $mimeType,
            'size' => $file->getSize(),
            'uploaded_at' => now()->toISOString(),
        ];

        $timelineItem->update(['attachments' => $attachments]);

        return back()->with('success', 'File uploaded successfully!');
    }

    public function delete(DeleteAttachmentRequest $request, string $timelineItemId, string $attachmentId)
    {
        $timelineItem = TimelineItem::findOrFail($timelineItemId);

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
