<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'content' => $this->content,
            'is_private' => $this->is_private ?? false,
            'parent_comment_id' => $this->parent_comment_id ? (string) $this->parent_comment_id : null,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => (string) $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'role' => $this->user->getRoleNames()->first(),
                ];
            }),
            'timeline_item' => $this->whenLoaded('timelineItem', function () {
                return [
                    'id' => (string) $this->timelineItem->id,
                    'title' => $this->timelineItem->title,
                ];
            }),
            'replies' => $this->whenLoaded('replies', function () {
                return self::collection($this->replies);
            }, []),
            'replies_count' => $this->when(! $this->relationLoaded('replies'), function () {
                return $this->replies()->count();
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
