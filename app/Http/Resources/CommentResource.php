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
            'parent_comment_id' => $this->parent_comment_id ? (string) $this->parent_comment_id : null,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->getRoleNames()->first(),
            ],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
