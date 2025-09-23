<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Family;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $stats = null;
        $timelineCases = null;

        if ($user) {
            if ($user->hasRole('admin')) {
                // Admin stats - system wide
                $stats = [
                    'users_count' => User::count(),
                    'families_count' => Family::count(),
                    'timeline_items_count' => Event::count(),
                    'comments_count' => Comment::count(),
                    'average_session_time' => 'N/A',
                ];

                // Get all users for impersonation (excluding current admin)
                $impersonatableUsers = User::where('id', '!=', $user->id)
                    ->with('roles')
                    ->get()
                    ->map(function ($impersonatableUser) {
                        return [
                            'id' => $impersonatableUser->id,
                            'name' => $impersonatableUser->name,
                            'email' => $impersonatableUser->email,
                            'role' => $impersonatableUser->getRoleNames()->first() ?? 'user',
                            'family_name' => $impersonatableUser->family?->name,
                        ];
                    });
            } elseif ($user->hasRole('myndighed')) {
                // Social worker stats - specific to their families
                $families = Family::where('created_by', $user->id)->get();
                $familyIds = $families->pluck('id');

                $stats = [
                    'users_count' => User::whereIn('family_id', $familyIds)->count(),
                    'families_count' => $families->count(),
                    'timeline_items_count' => Event::whereIn('family_id', $familyIds)->count(),
                    'comments_count' => Comment::whereHas('timelineItem', function ($query) use ($familyIds) {
                        $query->whereIn('family_id', $familyIds);
                    })->count(),
                    'average_session_time' => 'N/A',
                ];

                // Get timeline cases for this social worker
                $timelineCases = Event::with(['user', 'family'])
                    ->whereIn('family_id', $familyIds)
                    ->orderBy('created_at', 'desc')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'title' => $item->title,
                            'content' => $item->content,
                            'category' => $item->category,
                            'created_at' => $item->created_at->format('Y-m-d H:i'),
                            'family_name' => $item->family->name,
                            'user_name' => $item->user->name,
                            'user_role' => $item->user->getRoleNames()->first() ?? 'user',
                        ];
                    });
            }
        }

        return Inertia::render('authenticated/dashboard', [
            'stats' => $stats,
            'timelineCases' => $timelineCases,
            'userRole' => $user ? $user->getRoleNames()->first() : null,
            'impersonatableUsers' => $impersonatableUsers ?? null,
            'isImpersonating' => $user && session()->has('impersonated_by'),
        ]);
    }
}
