<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('admin users receive dashboard statistics', function () {
    // Ensure admin role exists
    Role::firstOrCreate(['name' => 'admin']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('stats')
            ->where('stats.users_count', 1) // At least the admin user
            ->where('stats.families_count', 0) // No families in test
            ->where('stats.timeline_items_count', 0) // No timeline items in test
            ->where('stats.comments_count', 0) // No comments in test
        );
});

test('non-admin users do not receive dashboard statistics', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('stats', null)
        );
});
