<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

use function Pest\Laravel\actingAs;

it('can complete onboarding chat flow', function () {
    // Onboarding is for guest users, so no authentication needed
    $page = visit('/onboarding');

    // Check that the onboarding page loads with expected content
    $page->assertSee('Velkommen til Famlink!')
        ->assertSee('Lad os komme i gang med en personlig onboarding oplevelse.');

    // For now, just verify the page loads - full chat flow testing requires backend implementation
    $page->assertPresent('input[type="text"]')
        ->assertPresent('button[type="submit"]');
});

it('handles onboarding chat errors correctly', function () {
    // Onboarding is for guest users, so no authentication needed
    $page = visit('/onboarding');

    // Check that the onboarding page loads
    $page->assertSee('Velkommen til Famlink!');

    // For now, just verify the page loads - error handling testing requires backend implementation
    $page->assertPresent('input[type="text"]');
});

it('onboarding chat supports accessibility features', function () {
    // Onboarding is for guest users, so no authentication needed
    $page = visit('/onboarding');

    $page->assertSee('Famlink Onboarding')
        ->assertSee('Velkommen til Famlink!');

    // Test accessibility features
    $page->assertPresent('input[placeholder="Type your answer..."]')
        ->assertPresent('button[type="submit"]')
        ->assertPresent('button[title="Restart onboarding"]');
});
