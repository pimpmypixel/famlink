<?php

use App\Models\User;
use Vizra\VizraADK\Models\AgentMessage;
use Vizra\VizraADK\Models\AgentSession;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('unauthenticated user cannot access messages', function () {
    $response = get('/api/vizra/customer_support/messages');

    $response->assertRedirect('/login');
});

test('authenticated user can access messages endpoint', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/api/vizra/customer_support/messages');

    $response->assertStatus(200);
});

test('returns empty messages when no sessions exist', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/api/vizra/customer_support/messages');

    $response->assertStatus(200)
        ->assertJson([
            'messages' => [],
        ]);
});

test('returns messages for existing sessions', function () {
    $user = User::factory()->create();

    // Create a session for the agent (Vizra ADK stores user_id as null)
    $session = AgentSession::create([
        'session_id' => 'test-session-'.now()->timestamp,
        'agent_name' => 'customer_support',
        'user_id' => null, // Vizra ADK currently doesn't associate sessions with users
        'state_data' => '{}',
    ]);

    // Create some messages
    AgentMessage::create([
        'agent_session_id' => $session->id,
        'role' => 'user',
        'content' => 'Hello, I need help',
        'created_at' => now()->subMinutes(5),
    ]);

    AgentMessage::create([
        'agent_session_id' => $session->id,
        'role' => 'assistant',
        'content' => 'How can I help you?',
        'created_at' => now()->subMinutes(4),
    ]);

    $response = actingAs($user)->get('/api/vizra/customer_support/messages');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'messages' => [
                '*' => [
                    'role',
                    'content',
                    'timestamp',
                ],
            ],
            'total_sessions',
            'sessions' => [
                '*' => [
                    'id',
                    'session_id',
                    'created_at',
                ],
            ],
            'note',
        ])
        ->assertJsonCount(2, 'messages')
        ->assertJsonCount(1, 'sessions');
});

test('messages are returned in chronological order', function () {
    $user = User::factory()->create();

    $session = AgentSession::create([
        'session_id' => 'test-session-chrono-'.now()->timestamp,
        'agent_name' => 'customer_support',
        'user_id' => null, // Vizra ADK currently doesn't associate sessions with users
        'state_data' => '{}',
    ]);

    // Create messages with distinct timestamps using sleep to ensure different timestamps
    $firstMessage = AgentMessage::create([
        'agent_session_id' => $session->id,
        'role' => 'user',
        'content' => 'First message',
    ]);
    sleep(1); // Ensure different timestamp

    $secondMessage = AgentMessage::create([
        'agent_session_id' => $session->id,
        'role' => 'assistant',
        'content' => 'Second message',
    ]);
    sleep(1); // Ensure different timestamp

    $thirdMessage = AgentMessage::create([
        'agent_session_id' => $session->id,
        'role' => 'assistant',
        'content' => 'Third message',
    ]);

    $response = actingAs($user)->get('/api/vizra/customer_support/messages');

    $response->assertStatus(200);

    $messages = $response->json('messages');

    // Check that messages are in chronological order by comparing timestamps
    expect(count($messages))->toBe(3);
    expect(strtotime($messages[0]['timestamp']))->toBeLessThanOrEqual(strtotime($messages[1]['timestamp']));
    expect(strtotime($messages[1]['timestamp']))->toBeLessThanOrEqual(strtotime($messages[2]['timestamp']));

    // Also check content order
    expect($messages[0]['content'])->toBe('First message');
    expect($messages[1]['content'])->toBe('Second message');
    expect($messages[2]['content'])->toBe('Third message');
});
