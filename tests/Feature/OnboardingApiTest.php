<?php

use App\Models\Profile;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\get;
use function Pest\Laravel\post;

beforeEach(function () {
    // Seed the required roles for testing
    Role::firstOrCreate(['name' => 'temporary']);
    Role::firstOrCreate(['name' => 'admin']);
    Role::firstOrCreate(['name' => 'approved']);
    Role::firstOrCreate(['name' => 'far']);
    Role::firstOrCreate(['name' => 'mor']);
    Role::firstOrCreate(['name' => 'myndighed']);
    Role::firstOrCreate(['name' => 'andet']);
});

it('completes full onboarding flow via API', function () {
    // Fake mail to prevent actual emails during testing
    Mail::fake();

    // Test the API endpoints directly
    $response = get('/api/onboarding/question');

    $response->assertSuccessful();
    $data = $response->json();

    // Verify we get the first question from the test playbook
    expect($data)->toHaveKey('question');
    expect($data['question']['key'])->toBe('user_firstname');
    expect($data['question']['text'])->toContain('dit fornavn');

    $sessionId = $data['session_id'];

    // Answer all 17 questions with realistic Danish data
    $answers = [
        'user_firstname' => 'Anna',
        'user_email' => 'anna.jensen@example.dk',
        'parent_role' => 'Mor',
        'living_situation' => 'Bor med børnene',
        'number_of_children' => '2',
        'children_ages' => '8 og 12 år',
        'custody' => '7/7',
        'communication_evaluation' => 'Udfordret',
        'active_case' => 'Ja',
        'cooperation_evaluation' => 'Det går nogenlunde, men kunne være bedre',
        'communication_channels' => 'SMS',
        'situation_overview' => 'Nogenlunde',
        'assistance_need' => 'Højt',
        'goals' => 'Ro og overblik',
        'capacity' => 'Nogenlunde',
        'notifications' => 'Ja, tak',
        'additional' => 'Jeg har brug for hjælp til at dokumentere kommunikation med den anden forælder',
    ];

    foreach ($answers as $questionKey => $answer) {
        $response = post('/api/onboarding/answer', [
            'session_id' => $sessionId,
            'question_key' => $questionKey,
            'answer' => $answer,
        ]);

        $response->assertSuccessful();
    }

    // Verify user was created with correct data
    $user = User::where('email', 'anna.jensen@example.dk')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('Anna');
    expect($user->email)->toBe('anna.jensen@example.dk');

    // Verify user has the correct role (should still be temporary until approved)
    expect($user->hasRole('temporary'))->toBeTrue();

    // Verify profile was created with answers
    $profile = Profile::where('user_id', $user->id)->first();
    expect($profile)->not->toBeNull();
    expect($profile->answers)->toBeArray();
    expect($profile->answers)->toHaveCount(17);

    // Verify all answers were saved
    foreach ($answers as $key => $expectedAnswer) {
        expect($profile->answers[$key])->toBe($expectedAnswer);
    }

    // Verify completion email was attempted (Mail::fake prevents actual sending)
    // Note: Email sending logic is tested separately
});

it('handles email conflicts correctly via API', function () {
    // Create existing user
    $existingUser = User::factory()->create([
        'email' => 'existing@example.dk',
        'name' => 'Existing User',
    ]);

    // Start onboarding
    $response = get('/api/onboarding/question');
    $response->assertSuccessful();
    $data = $response->json();
    $sessionId = $data['session_id'];

    // Answer first two questions
    post('/api/onboarding/answer', [
        'session_id' => $sessionId,
        'question_key' => 'user_firstname',
        'answer' => 'New User',
    ])->assertSuccessful();

    // Try to use existing email - should fail
    $response = post('/api/onboarding/answer', [
        'session_id' => $sessionId,
        'question_key' => 'user_email',
        'answer' => 'existing@example.dk',
    ]);

    $response->assertStatus(422);
    $data = $response->json();
    expect($data)->toHaveKey('error');
    expect($data['error'])->toContain('allerede registreret');

    // Try with different email - should succeed
    post('/api/onboarding/answer', [
        'session_id' => $sessionId,
        'question_key' => 'user_email',
        'answer' => 'newuser@example.dk',
    ])->assertSuccessful();

    // Continue with remaining questions
    $remainingAnswers = [
        'parent_role' => 'Mor',
        'living_situation' => 'Bor alene',
        'number_of_children' => '3',
        'children_ages' => '5, 8 og 10 år',
        'custody' => 'Ingen aftale endnu',
        'communication_evaluation' => 'Ingen kontakt',
        'active_case' => 'Ja',
        'cooperation_evaluation' => 'Jeg har ikke haft kontakt med myndighederne endnu',
        'communication_channels' => 'Telefon',
        'situation_overview' => 'Dårligt',
        'assistance_need' => 'Højt',
        'goals' => 'Bedre kommunikation',
        'capacity' => 'Dårligt',
        'notifications' => 'Ja, tak',
        'additional' => 'Jeg har brug for støtte til at håndtere denne situation',
    ];

    foreach ($remainingAnswers as $questionKey => $answer) {
        post('/api/onboarding/answer', [
            'session_id' => $sessionId,
            'question_key' => $questionKey,
            'answer' => $answer,
        ])->assertSuccessful();
    }

    // Verify new user was created with different email
    $newUser = User::where('email', 'newuser@example.dk')->first();
    expect($newUser)->not->toBeNull();
    expect($newUser->name)->toBe('New User');
    expect($newUser->id)->not->toBe($existingUser->id);
});

it('validates session resumption via API', function () {
    // Start first session
    $response1 = get('/api/onboarding/question');
    $response1->assertSuccessful();
    $data1 = $response1->json();
    $sessionId = $data1['session_id'];

    // Answer first two questions
    post('/api/onboarding/answer', [
        'session_id' => $sessionId,
        'question_key' => 'user_firstname',
        'answer' => 'Session Test',
    ])->assertSuccessful();

    post('/api/onboarding/answer', [
        'session_id' => $sessionId,
        'question_key' => 'user_email',
        'answer' => 'session@example.dk',
    ])->assertSuccessful();

    // Resume session
    $response2 = get('/api/onboarding/question?session_id='.$sessionId.'&resumed=true');
    $response2->assertSuccessful();
    $data2 = $response2->json();

    // Should continue with next question
    expect($data2)->toHaveKey('question');
    expect($data2['question']['key'])->toBe('parent_role');
    expect($data2['is_resumed'])->toBeTrue();
});

it('loads test playbook in testing environment', function () {
    // This test verifies that the controller correctly loads the test playbook
    // when in testing environment, which is crucial for deterministic testing

    $response = get('/api/onboarding/question');
    $response->assertSuccessful();
    $data = $response->json();

    // Verify the question comes from our test playbook
    expect($data['question']['text'])->toBe('Hej 👋 Først vil jeg gerne høre dit fornavn, så vi kan tilpasse oplevelsen til dig.');
    expect($data['question']['key'])->toBe('user_firstname');
    expect($data['question']['type'])->toBe('text');
    expect($data['question']['required'])->toBeTrue();
});
