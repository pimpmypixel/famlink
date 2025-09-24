<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\OnboardingController;
use Illuminate\Support\Facades\Route;

// Chat routes for approved users
Route::middleware(['web', 'auth'])->prefix('chat')->group(function () {
    Route::post('message', [ChatController::class, 'sendMessage']);
    Route::get('messages', [ChatController::class, 'getMessages']);
});
