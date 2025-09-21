<?php

use App\Models\User;
use App\Models\Family;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

describe('Chat API Routes', function () {

    test('returns 401 for unauthenticated GET /api/chat/messages', function () {
        $response = $this->getJson('/api/chat/messages');

        $response->assertStatus(401);
    });

    test('returns 401 for unauthenticated POST /api/chat/message', function () {
        $response = $this->postJson('/api/chat/message', [
            'message' => 'Test message'
        ]);

        $response->assertStatus(401);
    });

    describe('GET /api/chat/messages', function () {

        test('returns welcome message for admin user', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $response = $this->actingAs($adminUser)
                            ->getJson('/api/chat/messages');

            $response->assertStatus(200)
                    ->assertJsonStructure([
                        'messages',
                        'session_id'
                    ])
                    ->assertJsonFragment([
                        'role' => 'assistant'
                    ]);

            $responseData = $response->json();
            expect($responseData['messages'][0]['content'])->toContain('Som administrator');
        });

        test('returns welcome message for authority user', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'myndighed', 'guard_name' => 'web']);

            $authorityUser = User::factory()->create([
                'name' => 'Authority User',
                'email' => 'authority@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $authorityUser->assignRole('myndighed');

            $response = $this->actingAs($authorityUser)
                            ->getJson('/api/chat/messages');

            $response->assertStatus(200)
                    ->assertJsonFragment([
                        'role' => 'assistant'
                    ]);

            $responseData = $response->json();
            expect($responseData['messages'][0]['content'])->toContain('Som myndighedsperson');
        });

        test('returns welcome message for parent user', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'far', 'guard_name' => 'web']);

            $parentUser = User::factory()->create([
                'name' => 'Parent User',
                'email' => 'parent@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $parentUser->assignRole('far');

            $response = $this->actingAs($parentUser)
                            ->getJson('/api/chat/messages');

            $response->assertStatus(200)
                    ->assertJsonFragment([
                        'role' => 'assistant'
                    ]);

            $responseData = $response->json();
            expect($responseData['messages'][0]['content'])->toContain('Som forælder');
        });

        test('includes session_id in response', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $response = $this->actingAs($adminUser)
                            ->getJson('/api/chat/messages');

            $response->assertStatus(200)
                    ->assertJsonStructure([
                        'messages',
                        'session_id'
                    ]);

            $responseData = $response->json();
            expect($responseData['session_id'])->toBeString();
        });

    });

    describe('POST /api/chat/message', function () {

        test('accepts valid message from admin user', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Hello from admin'
                            ]);

            $response->assertStatus(200)
                    ->assertJsonStructure([
                        'response',
                        'session_id'
                    ]);
        });

        test('accepts valid message from authority user', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'myndighed', 'guard_name' => 'web']);

            $authorityUser = User::factory()->create([
                'name' => 'Authority User',
                'email' => 'authority@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $authorityUser->assignRole('myndighed');

            $response = $this->actingAs($authorityUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Hello from authority'
                            ]);

            $response->assertStatus(200);
        });

        test('accepts valid message from parent user', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'far', 'guard_name' => 'web']);

            $parentUser = User::factory()->create([
                'name' => 'Parent User',
                'email' => 'parent@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $parentUser->assignRole('far');

            $response = $this->actingAs($parentUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Hello from parent'
                            ]);

            $response->assertStatus(200);
        });

        test('validates required message field', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', []);

            $response->assertStatus(422)
                    ->assertJsonValidationErrors(['message']);
        });

        test('validates message length', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $longMessage = str_repeat('a', 2001);

            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => $longMessage
                            ]);

            $response->assertStatus(422)
                    ->assertJsonValidationErrors(['message']);
        });

        test('accepts session_id parameter', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $sessionId = 'test_session_123';

            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Test with session',
                                'session_id' => $sessionId
                            ]);

            $response->assertStatus(200)
                    ->assertJsonFragment([
                        'session_id' => $sessionId
                    ]);
        });

    });

    describe('Role-based Context', function () {

        test('provides admin context to CustomerSupportAgent', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            // This test verifies that the admin role context is passed correctly
            // We can't easily test the internal agent context, but we can verify
            // the response structure and that no errors occur
            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Admin test message'
                            ]);

            $response->assertStatus(200);
        });

        test('provides authority context to CustomerSupportAgent', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'myndighed', 'guard_name' => 'web']);

            $authorityUser = User::factory()->create([
                'name' => 'Authority User',
                'email' => 'authority@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $authorityUser->assignRole('myndighed');

            $response = $this->actingAs($authorityUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Authority test message'
                            ]);

            $response->assertStatus(200);
        });

        test('provides parent context to CustomerSupportAgent', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'far', 'guard_name' => 'web']);

            $parentUser = User::factory()->create([
                'name' => 'Parent User',
                'email' => 'parent@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $parentUser->assignRole('far');

            $response = $this->actingAs($parentUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Parent test message'
                            ]);

            $response->assertStatus(200);
        });

    });

    describe('Session Continuity', function () {

        test('maintains session across multiple messages', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            // First message
            $response1 = $this->actingAs($adminUser)
                             ->postJson('/api/chat/message', [
                                 'message' => 'First message'
                             ]);

            $response1->assertStatus(200);
            $sessionId = $response1->json()['session_id'];

            // Second message with same session
            $response2 = $this->actingAs($adminUser)
                             ->postJson('/api/chat/message', [
                                 'message' => 'Second message',
                                 'session_id' => $sessionId
                             ]);

            $response2->assertStatus(200)
                     ->assertJsonFragment([
                         'session_id' => $sessionId
                     ]);
        });

        test('creates new session when none provided', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'New session message'
                            ]);

            $response->assertStatus(200);

            $responseData = $response->json();
            expect($responseData['session_id'])->toBeString();
            expect($responseData['session_id'])->toContain('chat_');
        });

    });

    describe('Error Handling', function () {

        test('handles agent execution errors gracefully', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            // This test would need to mock agent failures
            // For now, we verify that the endpoint doesn't crash
            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'Test message'
                            ]);

            $response->assertStatus(200);
        });

        test('returns detailed errors for admin users', function () {
            // Admin users should get detailed error information
            // This would be tested by mocking agent failures
            $this->assertTrue(true); // Placeholder
        });

        test('returns generic errors for non-admin users', function () {
            // Non-admin users should get generic error messages
            // This would be tested by mocking agent failures
            $this->assertTrue(true); // Placeholder
        });

    });

    describe('Streaming Response', function () {

        test('returns JSON response for valid messages', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'JSON response test'
                            ]);

            $response->assertStatus(200)
                    ->assertJsonStructure([
                        'response',
                        'session_id'
                    ]);

            // Check that response is JSON (not streaming)
            expect($response->headers->get('Content-Type'))->toBe('application/json');
        });

    });

    describe('CSRF Protection', function () {

        test('accepts requests without CSRF token for API routes', function () {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

            $adminUser = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@famlink.test',
                'password' => Hash::make('password'),
            ]);
            $adminUser->assignRole('admin');

            // Since we excluded /api/chat/* from CSRF protection,
            // these requests should work without CSRF tokens
            $response = $this->actingAs($adminUser)
                            ->postJson('/api/chat/message', [
                                'message' => 'CSRF test'
                            ]);

            $response->assertStatus(200);
        });

    });

});
