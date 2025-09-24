<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $impersonatableUsers = null;

        // Get impersonatable users for admin users
        if ($user && ($user->hasRole('admin') || $user->hasRole('super-admin'))) {
            $impersonatableUsers = \App\Models\User::where('id', '!=', $user->id)
                ->whereDoesntHave('roles', function ($query) {
                    $query->whereIn('name', ['admin', 'super-admin']);
                })
                ->with('family') // Load family relationship
                ->select('id', 'first_name', 'email', 'family_id')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->getRoleNames()->first() ?? 'user',
                        'family_name' => $user->family?->name ?? 'No Family',
                    ];
                })
                ->toArray();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user ? [
                    ...$user->toArray(),
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getPermissionNames(),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'isImpersonating' => $user && session()->has('impersonated_by'),
            'impersonatableUsers' => $impersonatableUsers,
            'translations' => [
                'messages' => include lang_path(app()->getLocale().'/messages.php'),
            ],
        ];
    }
}
