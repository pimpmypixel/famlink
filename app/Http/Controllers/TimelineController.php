<?php

namespace App\Http\Controllers;

use App\Http\Resources\TimelineItemResource;
use App\Models\TimelineItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimelineController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Check if user has a family
        if (! $user->family) {
            return Inertia::render('authenticated/timeline_page', [
                'timelineItems' => [],
            ]);
        }

        $timelineItems = TimelineItem::with('user', 'user.roles', 'comments', 'comments.user')
            ->orderBy('item_timestamp', 'desc')
            ->whereIn('user_id', $user->family->users()->pluck('id'))
            ->get();

        return Inertia::render('authenticated/timeline_page', [
            'timelineItems' => TimelineItemResource::collection($timelineItems)->resolve(),
        ]);
    }
}
