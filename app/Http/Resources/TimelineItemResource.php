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
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'date' => $this->date->format('Y-m-d'),
            'timestamp' => $this->item_timestamp->getTimestamp() * 1000, // Convert to milliseconds for JS
            'category' => $this->category,
            'tags' => $this->tags ?? [], // Ensure tags is always an array
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->getRoleNames()->first(), // Get the first role name
            ],
        ];
    }
}
