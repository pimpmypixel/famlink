<?php

namespace App\Data;

use App\Models\Comment;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CommentData extends Data
{
    public function __construct(
        public string $id,
        public string $content,
        public bool $is_private,
        public ?string $parent_comment_id,
        public Lazy|UserData|null $user,
        public Lazy|EventData|null $timeline_item,
        public Lazy|CommentDataCollection|null $replies,
        public ?int $replies_count,
        public ?string $created_at,
        public ?string $updated_at,
    ) {}

    public static function fromModel(Comment $comment): self
    {
        return new self(
            id: (string) $comment->id,
            content: $comment->content,
            is_private: $comment->is_private ?? false,
            parent_comment_id: $comment->parent_comment_id ? (string) $comment->parent_comment_id : null,
            user: Lazy::create(fn () => $comment->relationLoaded('user') ? UserData::fromModel($comment->user) : null),
            timeline_item: Lazy::create(fn () => $comment->relationLoaded('timelineItem') ? EventData::fromModel($comment->timelineItem) : null),
            replies: Lazy::create(fn () => $comment->relationLoaded('replies') ? CommentDataCollection::from($comment->replies) : null),
            replies_count: $comment->relationLoaded('replies') ? null : $comment->replies()->count(),
            created_at: $comment->created_at?->toISOString(),
            updated_at: $comment->updated_at?->toISOString(),
        );
    }
}
