<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EmailVerificationController extends Controller
{
    /**
     * Verify user email address
     */
    public function verify(Request $request, User $user)
    {
        try {
            // Mark email as verified
            $user->email_verified_at = now();
            $user->save();

            // If user was temporary, upgrade to approved role
            if ($user->hasRole('temporary')) {
                $user->removeRole('temporary');
                $user->assignRole('approved');
            }

            Log::info('Email verified successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            // Redirect to login page with success message
            return Inertia::render('auth/login', [
                'status' => 'email-verified',
                'message' => 'Din email er nu verificeret! Du kan nu logge ind på Famlink.',
            ]);

        } catch (\Exception $e) {
            Log::error('Email verification failed', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);

            // Redirect to login with error
            return Inertia::render('auth/login', [
                'status' => 'verification-failed',
                'message' => 'Der opstod en fejl under verifikationen af din email. Prøv venligst igen eller kontakt support.',
            ]);
        }
    }
}
