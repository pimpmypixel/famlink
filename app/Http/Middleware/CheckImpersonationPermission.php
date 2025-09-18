<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckImpersonationPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user is authenticated
        if (! $user) {
            abort(403, 'Unauthorized');
        }

        // Check if current user can impersonate
        if (! $user->canImpersonate()) {
            abort(403, 'You do not have permission to impersonate users');
        }

        // For impersonation take route, check if target user can be impersonated
        if ($request->route() && $request->route()->getName() === 'impersonate.take') {
            $targetUserId = $request->route('id');
            $targetUser = User::find($targetUserId);

            if (! $targetUser) {
                abort(404, 'User not found');
            }

            if (! $targetUser->canBeImpersonated()) {
                abort(403, 'This user cannot be impersonated');
            }
        }

        return $next($request);
    }
}
