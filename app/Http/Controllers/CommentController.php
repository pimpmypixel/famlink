<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\TimelineItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, string $timelineItemId)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'parent_comment_id' => 'nullable|string|exists:comments,id',
        ]);

        $timelineItem = TimelineItem::findOrFail($timelineItemId);
        $user = Auth::user();

        // Check if user can comment on this timeline item
        if (! $this->canCommentOnTimelineItem($user, $timelineItem)) {
            abort(403, 'You are not authorized to comment on this timeline item.');
        }

        // If replying to a comment, verify the parent comment belongs to the same timeline item
        if ($request->parent_comment_id) {
            $parentComment = Comment::findOrFail($request->parent_comment_id);
            if ($parentComment->timeline_item_id !== $timelineItemId) {
                abort(422, 'Invalid parent comment.');
            }
        }

        $comment = Comment::create([
            'timeline_item_id' => $timelineItemId,
            'user_id' => $user->id,
            'content' => $request->content,
            'parent_comment_id' => $request->parent_comment_id,
        ]);

        return back()->with('success', $request->parent_comment_id ? 'Reply added successfully!' : 'Comment added successfully!');
    }

    private function canCommentOnTimelineItem($user, TimelineItem $timelineItem): bool
    {
        // Social workers can comment on any timeline item
        if ($user->hasRole('myndighed')) {
            return true;
        }

        // Users can comment on timeline items from their own family
        return $user->family_id === $timelineItem->family_id;
    }
}
