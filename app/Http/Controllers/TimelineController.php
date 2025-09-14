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
        $timelineItems = TimelineItem::with('user','user.roles')
            ->orderBy('item_timestamp', 'desc')
            ->whereIn('user_id', auth()->user()->family->users()->get('id'))
            ->get();

        return Inertia::render('timeline', [
            'timelineItems' => TimelineItemResource::collection($timelineItems)->resolve(),
        ]);
    }
}
