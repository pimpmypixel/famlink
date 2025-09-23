<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Route testing routes (for debugging)
Route::get('/debug/routes', [App\Http\Controllers\RouteTestController::class, 'testAllRoutes'])->name('debug.routes');
Route::get('/debug/routes/{method}/{path}', [App\Http\Controllers\RouteTestController::class, 'testSpecificRoute'])
    ->name('debug.routes.specific')
    ->where('path', '.*');

// Guest onboarding route
Route::middleware('guest')->get('/onboarding', function () {
    return Inertia::render('onboarding');
})->name('onboarding');

// Onboarding API routes
Route::middleware(['web'])->prefix('api/onboarding')->group(function () {
    Route::get('question', [App\Http\Controllers\OnboardingController::class, 'getQuestion']);
    Route::post('answer', [App\Http\Controllers\OnboardingController::class, 'submitAnswer']);
    Route::get('stream/{sessionId}', [App\Http\Controllers\OnboardingController::class, 'streamAnswer']);
    Route::post('approve/{userId}', [App\Http\Controllers\OnboardingController::class, 'approveUser']);
});

// Web Tinker route (unauthenticated for development)
Route::middleware([
    Illuminate\Cookie\Middleware\EncryptCookies::class,
    Illuminate\Session\Middleware\StartSession::class,
])->group(function () {
    Route::get('/tinker', [Spatie\WebTinker\Http\Controllers\WebTinkerController::class, 'index'])->name('web-tinker');
    Route::post('/tinker', [Spatie\WebTinker\Http\Controllers\WebTinkerController::class, 'execute']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('userguide', [App\Http\Controllers\UserguideController::class, 'index'])->name('userguide');

    Route::get('timeline', function () {
        return Inertia::render('timeline');
    })->name('timeline.public');

    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('intro', function () {
        return Inertia::render('intro');
    })->name('intro');

    Route::get('timeline', [App\Http\Controllers\TimelineController::class, 'index'])->name('timeline');

    // Impersonation routes
    Route::middleware('impersonate')->group(function () {
        Route::impersonate();
    });

    // Comment routes
    Route::post('timeline/{timelineItemId}/comments', [App\Http\Controllers\CommentController::class, 'store'])->name('timeline.comments.store');

    // File upload routes
    Route::post('timeline/{timelineItemId}/upload', [App\Http\Controllers\FileUploadController::class, 'upload'])->name('timeline.upload');
    Route::delete('timeline/{timelineItemId}/attachment/{attachmentId}', [App\Http\Controllers\FileUploadController::class, 'delete'])->name('timeline.attachment.delete');

    // Vizra Agent API routes
    Route::get('api/vizra/{agentName}/messages', [App\Http\Controllers\Api\VizraAgentController::class, 'getMessages'])->name('api.vizra.messages');

    // Vizra Agent API routes
    Route::get('api/vizra/{agentName}/messages', [App\Http\Controllers\Api\VizraAgentController::class, 'getMessages'])->name('api.vizra.messages');

    // Chat routes moved to api.php
    // Route::prefix('api/chat')->group(function () {
    //     Route::post('message', [App\Http\Controllers\ChatController::class, 'sendMessage'])->name('api.chat.message');
    //     Route::get('messages', [App\Http\Controllers\ChatController::class, 'getMessages'])->name('api.chat.messages');
    // });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
