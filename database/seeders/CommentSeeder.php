<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialWorkers = User::role('myndighed')->get();
        $timelineItems = TimelineItem::all();

        $this->createCommentsAndReplies($timelineItems, $socialWorkers);
        $this->ensureAllTimelineItemsHaveComments($socialWorkers);
    }

    /**
     * Create comments and replies for timeline items
     */
    private function createCommentsAndReplies($timelineItems, $socialWorkers): void
    {
        foreach ($timelineItems as $timelineItem) {
            // Get users who can comment on this timeline item
            $familyUsers = $timelineItem->family?->users ?? collect();
            $allowedUsers = $familyUsers->merge($socialWorkers)->unique('id');

            if ($allowedUsers->isEmpty()) {
                continue;
            }

            // Create at least 1 comment per timeline item (guaranteed)
            $numComments = fake()->numberBetween(1, 5);
            $comments = [];

            for ($i = 0; $i < $numComments; $i++) {
                $commentUser = $allowedUsers->random();
                $comment = Comment::create([
                    'timeline_item_id' => $timelineItem->id,
                    'user_id' => $commentUser->id,
                    'content' => fake()->paragraph(),
                    'is_private' => fake()->boolean(5), // 5% chance of being private
                ]);
                $comments[] = $comment;
            }

            // Create at least 1 reply for each comment (guaranteed)
            foreach ($comments as $comment) {
                $numReplies = fake()->numberBetween(1, 3); // Guaranteed at least 1 reply
                $replyUsers = $allowedUsers->filter(fn ($user) => $user->id !== $comment->user_id);

                if ($replyUsers->isNotEmpty()) {
                    for ($i = 0; $i < $numReplies; $i++) {
                        $replyUser = $replyUsers->random();
                        Comment::create([
                            'timeline_item_id' => $timelineItem->id,
                            'user_id' => $replyUser->id,
                            'parent_comment_id' => $comment->id,
                            'content' => fake()->paragraph(),
                            'is_private' => fake()->boolean(3), // 3% chance of being private
                        ]);
                    }
                } else {
                    // If no other users available, create a reply from a social worker
                    $replyUser = $socialWorkers->where('id', '!=', $comment->user_id)->first() ?? $socialWorkers->first();
                    if ($replyUser) {
                        Comment::create([
                            'timeline_item_id' => $timelineItem->id,
                            'user_id' => $replyUser->id,
                            'parent_comment_id' => $comment->id,
                            'content' => fake()->paragraph(),
                            'is_private' => false,
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Ensure ALL timeline items have at least 1 comment
     */
    private function ensureAllTimelineItemsHaveComments($socialWorkers): void
    {
        $timelineItemsWithoutComments = TimelineItem::doesntHave('comments')->get();

        if ($timelineItemsWithoutComments->isEmpty()) {
            return;
        }

        if ($this->command) {
            $this->command->info("Found {$timelineItemsWithoutComments->count()} timeline items without comments. Adding comments...");
        }

        foreach ($timelineItemsWithoutComments as $timelineItem) {
            // Get users who can comment on this timeline item
            $familyUsers = $timelineItem->family?->users ?? collect();
            $allowedUsers = $familyUsers->merge($socialWorkers)->unique('id');

            if ($allowedUsers->isEmpty()) {
                // If no users available, skip this item
                continue;
            }

            // Create at least 1 comment
            $commentUser = $allowedUsers->random();
            Comment::create([
                'timeline_item_id' => $timelineItem->id,
                'user_id' => $commentUser->id,
                'content' => fake()->paragraph(),
                'is_private' => fake()->boolean(5), // 5% chance of being private
            ]);
        }

        if ($this->command) {
            $this->command->info("Added comments to {$timelineItemsWithoutComments->count()} timeline items.");
        }
    }
}
