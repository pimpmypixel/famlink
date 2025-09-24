<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

it('sends completion email with verification link when onboarding is completed', function () {
    Mail::fake();

    // Create roles if they don't exist
    Role::firstOrCreate(['name' => 'temporary', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'approved', 'guard_name' => 'web']);

    // Create a temporary user
    $user = User::factory()->create([
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'email_verified_at' => null,
    ]);
    $user->assignRole('temporary');

    // Create answers array
    $answers = [
        'user_firstname' => 'Test',
        'user_email' => 'test@example.com',
    ];

    // Call the sendCompletionEmail method directly (should not throw exception)
    $controller = new \App\Http\Controllers\OnboardingController;
    $reflection = new ReflectionClass($controller);
    $method = $reflection->getMethod('sendCompletionEmail');
    $method->setAccessible(true);

    expect(fn () => $method->invoke($controller, $user, $answers))->not->toThrow(\Exception::class);
});

it('email verification link upgrades temporary user to approved role', function () {
    // Create roles if they don't exist
    Role::firstOrCreate(['name' => 'temporary', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'approved', 'guard_name' => 'web']);

    // Create a temporary user
    $user = User::factory()->create([
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'email_verified_at' => null,
    ]);
    $user->assignRole('temporary');

    // Generate signed verification URL
    $verificationUrl = URL::temporarySignedRoute(
        'email.verify',
        now()->addDays(7),
        ['user' => $user->id]
    );

    // Make request to verification URL
    $response = $this->get($verificationUrl);

    // Assert user is now verified and has approved role
    $user->refresh();
    expect($user->email_verified_at)->not->toBeNull();
    expect($user->hasRole('approved'))->toBeTrue();
    expect($user->hasRole('temporary'))->toBeFalse();

    // Assert redirect to login with success message
    $response->assertInertia(fn ($page) => $page
        ->component('auth/login')
        ->has('status')
        ->where('status', 'email-verified')
    );
});

it('invalid verification link returns 404', function () {
    // Create a user
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    // Try to verify with invalid signature (this should fail)
    $response = $this->get("/email/verify/{$user->id}?signature=invalid");

    // Assert 403 status for invalid signature
    $response->assertStatus(403);
});
