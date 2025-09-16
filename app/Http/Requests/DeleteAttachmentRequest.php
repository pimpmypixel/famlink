<?php

namespace App\Http\Requests;

use App\Models\TimelineItem;
use Illuminate\Foundation\Http\FormRequest;

class DeleteAttachmentRequest extends FormRequest
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
        $user = auth()->user();

        return $user && $user->family_id === $timelineItem->family_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
