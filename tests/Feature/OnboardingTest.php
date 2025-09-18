<?php

declare(strict_types=1);

use function Pest\Laravel\get;

it('shows the onboarding page for guests', function () {
    get(route('onboarding'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('onboarding'));
});

it('redirects authenticated users away from onboarding', function () {
    $user = \App\Models\User::factory()->create();
    $this->actingAs($user);
    get(route('onboarding'))
        ->assertRedirect();
});
