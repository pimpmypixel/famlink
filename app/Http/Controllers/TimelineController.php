<?php

namespace App\Http\Controllers;

use App\Data\EventData;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimelineController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Check if user has a family
        if (! $user->family && ! $user->hasRole(['admin', 'super-admin'])) {
            return Inertia::render('authenticated/timeline_page', [
                'timelineItems' => [],
                'pagination' => [
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                    'from' => 0,
                    'to' => 0,
                ],
            ]);
        }

        $query = Event::with([
            'user:id,first_name,email',
            'comments' => function ($query) {
                $query->with('user:id,first_name')->latest()->limit(5);
            },
            'family:id,name,child_name',
            'category:id,name',
            'tags:id,name',
        ])
            ->orderBy('item_timestamp', 'desc');

        // Admin users can see all timeline items from all families
        if ($user->hasRole(['admin', 'super-admin'])) {
            $timelineItems = $query->paginate($request->get('per_page', 10));
        } else {
            // Regular users only see items from their family
            $timelineItems = $query->whereIn('user_id', $user->family->users()->pluck('id'))
                ->paginate($request->get('per_page', 10));
        }

        return Inertia::render('authenticated/timeline_page', [
            'timelineItems' => EventData::collect($timelineItems->getCollection())->toArray(),
            'pagination' => [
                'current_page' => $timelineItems->currentPage(),
                'last_page' => $timelineItems->lastPage(),
                'per_page' => $timelineItems->perPage(),
                'total' => $timelineItems->total(),
                'from' => $timelineItems->firstItem(),
                'to' => $timelineItems->lastItem(),
                'links' => $timelineItems->linkCollection(),
            ],
        ]);
    }
}
