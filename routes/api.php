<?php

use App\Http\Controllers\OnboardingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->prefix('onboarding')->group(function () {
    Route::get('question', [OnboardingController::class, 'getQuestion']);
    Route::post('answer', [OnboardingController::class, 'submitAnswer']);
    Route::get('stream/{sessionId}', [OnboardingController::class, 'streamAnswer']);
    Route::post('approve/{userId}', [OnboardingController::class, 'approveUser']);
});
