<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('admin users can see impersonatable users on dashboard', function () {
    // Ensure roles exist
    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'far']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $regularUser = User::factory()->create();
    $regularUser->assignRole('far');

    actingAs($admin);
    $response = $this->get(route('dashboard'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->has('impersonatableUsers')
        ->where('impersonatableUsers.0.name', $regularUser->name)
        ->where('impersonatableUsers.0.email', $regularUser->email)
        ->where('impersonatableUsers.0.role', 'far')
    );
});

it('non-admin users cannot see impersonatable users on dashboard', function () {
    // Ensure role exists
    Role::firstOrCreate(['name' => 'far']);

    $user = User::factory()->create();
    $user->assignRole('far');

    actingAs($user);
    $response = $this->get(route('dashboard'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->where('impersonatableUsers', null)
    );
});

it('admin users see isImpersonating false when not impersonating', function () {
    // Ensure role exists
    Role::firstOrCreate(['name' => 'admin']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    actingAs($admin);
    $response = $this->get(route('dashboard'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->where('isImpersonating', false)
    );
});

it('impersonation routes are accessible for authenticated users', function () {
    // Ensure roles exist
    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'far']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();
    $user->assignRole('far');

    actingAs($admin);

    // Test impersonate route
    $response = $this->get("/impersonate/take/{$user->id}");
    $response->assertStatus(302); // Should redirect

    // Test leave impersonation route
    $response = $this->get('/impersonate/leave');
    $response->assertStatus(302); // Should redirect
});

it('impersonation banner appears when impersonating', function () {
    // Ensure roles exist
    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'far']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();
    $user->assignRole('far');

    // Simulate impersonation by setting the session
    actingAs($admin);
    
    // Manually set the session to simulate impersonation
    session(['impersonated_by' => $admin->id]);

    $response = $this->get(route('dashboard'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->where('isImpersonating', true)
    );
});
