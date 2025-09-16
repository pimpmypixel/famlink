<?php

namespace App\Http\Requests;

use App\Models\TimelineItem;
use Illuminate\Foundation\Http\FormRequest;

class FileUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $timelineItemId = $this->route('timelineItemId');
        $timelineItem = TimelineItem::find($timelineItemId);

        if (! $timelineItem) {
            return false;
        }

        // Check if user is in the same family as the timeline item owner
        return auth()->user()->family_id === $timelineItem->family_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:10240', // 10MB in kilobytes
                'mimes:jpeg,jpg,png,gif,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,mp4,avi,mov,mp3,wav',
            ],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Please select a file to upload.',
            'file.file' => 'The uploaded item must be a valid file.',
            'file.max' => 'File size must not exceed 10MB.',
            'file.mimes' => 'File type not supported. Supported types: JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, ZIP, RAR, MP4, AVI, MOV, MP3, WAV.',
        ];
    }
}
