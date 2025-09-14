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
        $timelineItems = TimelineItem::with('user')
            ->orderBy('item_timestamp', 'desc')
            ->get();

        return Inertia::render('Timeline', [
            'timelineItems' => TimelineItemResource::collection($timelineItems),
        ]);
    }
}
