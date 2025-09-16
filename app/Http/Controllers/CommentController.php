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
        ]);

        $timelineItem = TimelineItem::findOrFail($timelineItemId);
        $user = Auth::user();

        // Check if user can comment on this timeline item
        if (! $this->canCommentOnTimelineItem($user, $timelineItem)) {
            abort(403, 'You are not authorized to comment on this timeline item.');
        }

        $comment = Comment::create([
            'timeline_item_id' => $timelineItemId,
            'user_id' => $user->id,
            'content' => $request->content,
        ]);

        return back()->with('success', 'Comment added successfully!');
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
