<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('timeline', function () {
        return Inertia::render('timeline');
    })->name('timeline.public');

    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('intro', function () {
        return Inertia::render('intro');
    })->name('intro');

    Route::get('timeline', [App\Http\Controllers\TimelineController::class, 'index'])->name('timeline');

    // Impersonation routes
    Route::impersonate();

    // Comment routes
    Route::post('timeline/{timelineItemId}/comments', [App\Http\Controllers\CommentController::class, 'store'])->name('timeline.comments.store');

    // File upload routes
    Route::post('timeline/{timelineItemId}/upload', [App\Http\Controllers\FileUploadController::class, 'upload'])->name('timeline.upload');
    Route::delete('timeline/{timelineItemId}/attachment/{attachmentId}', [App\Http\Controllers\FileUploadController::class, 'delete'])->name('timeline.attachment.delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
