<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Family;
use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stats = null;

        // Only show stats for admin users
        if ($user && $user->hasRole('admin')) {
            $stats = [
                'users_count' => User::count(),
                'families_count' => Family::count(),
                'timeline_items_count' => TimelineItem::count(),
                'comments_count' => Comment::count(),
                'average_session_time' => 'N/A', // Placeholder for now
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    }
}
