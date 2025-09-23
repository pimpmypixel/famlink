<?php

namespace App\Data;

use App\Models\Event;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class EventData extends Data
{
    public function __construct(
        public string $id,
        public string $title,
        public string $content,
        public ?string $date,
        public ?string $timestamp,
        public bool $is_urgent,
        public ?string $author,
        public Lazy|CategoryData|null $category,
        public Lazy|TagDataCollection|null $tags,
        public ?UserData $user,
        public Lazy|FamilyData|null $family,
        public array $attachments,
        public array $linked_items,
        public Lazy|CommentDataCollection|null $comments,
        public ?int $comments_count,
        public array $meta,
    ) {}

    public static function fromModel(Event $event): self
    {
        return new self(
            id: (string) $event->id,
            title: $event->title,
            content: $event->content,
            date: $event->date?->format('Y-m-d'),
            timestamp: $event->item_timestamp?->toISOString(),
            is_urgent: $event->is_urgent ?? false,
            author: $event->author,
            category: Lazy::create(fn () => $event->relationLoaded('category') ? CategoryData::fromModel($event->category) : null),
            tags: Lazy::create(fn () => $event->relationLoaded('tags') ? TagDataCollection::from($event->tags) : null),
            user: $event->relationLoaded('user') ? UserData::fromModel($event->user) : null,
            family: Lazy::create(fn () => $event->relationLoaded('family') ? FamilyData::fromModel($event->family) : null),
            attachments: $event->attachments ?? [],
            linked_items: $event->linked_items ?? [],
            comments: Lazy::create(fn () => $event->relationLoaded('comments') ? CommentDataCollection::from($event->comments) : null),
            comments_count: $event->relationLoaded('comments') ? null : $event->comments()->count(),
            meta: [
                'created_at' => $event->created_at?->toISOString(),
                'updated_at' => $event->updated_at?->toISOString(),
            ],
        );
    }
}
