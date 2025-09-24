<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('danish locale is set as default', function () {
    expect(app()->getLocale())->toBe('da');
    expect(config('app.fallback_locale'))->toBe('da');
});

test('danish translations are loaded', function () {
    expect(__('messages.save'))->toBe('Gem');
    expect(__('messages.cancel'))->toBe('Annuller');
    expect(__('messages.error'))->toBe('Fejl');
});

test('auth translations are available', function () {
    expect(__('auth.failed'))->toBe('Disse loginoplysninger stemmer ikke overens med vores optegnelser.');
    expect(__('auth.throttle', ['seconds' => 60]))->toBe('For mange loginforsøg. Prøv igen om 60 sekunder.');
});

test('translations are passed to inertia', function () {
    $user = \App\Models\User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertInertia(function ($page) {
        $page->has('translations');
    });
});
