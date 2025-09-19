<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TimelineItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => (string) $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'date' => $this->date?->format('Y-m-d'),
            'timestamp' => $this->item_timestamp?->toISOString(),
            'is_urgent' => $this->is_urgent ?? false,
            'author' => $this->author,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                ];
            }),
            'tags' => $this->whenLoaded('tags', function () {
                return $this->tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name,
                    ];
                });
            }, []),
            'attachments' => $this->attachments ?? [],
            'linked_items' => $this->linked_items ?? [],
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => (string) $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'role' => $this->user->getRoleNames()->first(),
                ];
            }),
            'family' => $this->whenLoaded('family', function () {
                return [
                    'id' => (string) $this->family->id,
                    'name' => $this->family->name,
                    'child_name' => $this->family->child_name,
                ];
            }),
        ];

        // Include comments with pagination if loaded
        if ($this->relationLoaded('comments')) {
            $comments = $this->comments();

            // Check if pagination is requested
            if ($request->has('comments_per_page')) {
                $perPage = $request->input('comments_per_page', 10);
                $comments = $comments->paginate($perPage);
                $data['comments'] = CommentResource::collection($comments);
                $data['comments_pagination'] = [
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                    'per_page' => $comments->perPage(),
                    'total' => $comments->total(),
                ];
            } else {
                $data['comments'] = CommentResource::collection($comments->get());
                $data['comments_count'] = $comments->count();
            }
        }

        // Add metadata
        $data['meta'] = [
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];

        return $data;
    }
}
