<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('timeline', function () {
    return Inertia::render('timeline');
})->name('timeline.public');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('timeline', [App\Http\Controllers\TimelineController::class, 'index'])->name('timeline');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
