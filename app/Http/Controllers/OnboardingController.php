<?php

namespace App\Http\Controllers;

use App\Agents\OnboardingAgent;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Vizra\VizraADK\System\AgentContext;

class OnboardingController extends Controller
{
    /**
     * Get the next onboarding question for the session with streaming.
     */
    public function getQuestion(Request $request)
    {
        $sessionId = $request->input('session_id') ?: uniqid('onboarding_', true);
        $isResumed = $request->input('resumed', false);

        // Find or create profile for this session
        $profile = Profile::firstOrCreate(
            ['session_id' => $sessionId],
            ['answers' => []]
        );

        // Create temporary user if profile doesn't have one
        if (! $profile->user_id) {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Temporary User',
                'email' => 'temp-'.$sessionId.'@famlink.temp',
                'password' => Hash::make(Str::random(16)),
            ]);
            $user->assignRole('temporary');
            $profile->user_id = $user->id;
            $profile->save();
        }

        $answers = $profile->answers;

        // Load questions from playbook
        $questions = $this->loadQuestions();
        $questionList = $questions['questions'] ?? [];

        // Find next unanswered question
        $nextQuestion = null;
        foreach ($questionList as $q) {
            if (! isset($answers[$q['key']])) {
                $nextQuestion = $q;
                break;
            }
        }

        // If no more questions, return completion status
        if ($nextQuestion === null) {
            return response()->json([
                'question' => null,
                'answers' => $answers,
                'session_id' => $sessionId,
                'completed' => true,
                'message' => 'Onboarding completed! Welcome to Famlink.',
            ]);
        }

        // Use the agent to generate a personalized response with streaming
        return $this->streamAgentResponse($sessionId, $nextQuestion, $answers, $questionList, $isResumed);
    }

    /**
     * Submit an answer for the current question (non-streaming).
     */
    public function submitAnswer(Request $request)
    {
        $sessionId = $request->input('session_id') ?: uniqid('onboarding_', true);
        $questionKey = $request->input('question_key');
        $answer = $request->input('answer');

        if (! $questionKey || $answer === null) {
            return response()->json(['error' => 'Missing question_key or answer'], 422);
        }

        // Find or create profile for this session
        $profile = Profile::firstOrCreate(
            ['session_id' => $sessionId],
            ['answers' => []]
        );

        // Create temporary user if this is the first time and profile doesn't have a user
        if (! $profile->user_id) {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Temporary User', // Will be updated with real name
                'email' => 'temp-'.$sessionId.'@famlink.temp', // Will be updated with real email
                'password' => Hash::make(Str::random(16)),
            ]);
            $user->assignRole('temporary');
            $profile->user_id = $user->id;
            $profile->save();
        }

        $answers = $profile->answers;
        $answers[$questionKey] = $answer;
        $profile->answers = $answers;
        $profile->save();

        // Update user information based on the question answered
        $user = $profile->user;
        if ($user) {
            if ($questionKey === 'name') { // Name question
                $user->name = $answer;
                $user->save();
            } elseif ($questionKey === 'email') { // Email question
                $user->email = $answer;
                $user->save();
            }
        }

        return response()->json([
            'success' => true,
            'session_id' => $sessionId,
            'message' => 'Answer saved successfully',
        ]);
    }

    /**
     * Stream the next question response for a session.
     */
    public function streamAnswer(Request $request, string $sessionId)
    {
        // Find or create profile for this session
        $profile = Profile::firstOrCreate(
            ['session_id' => $sessionId],
            ['answers' => []]
        );

        // Create temporary user if profile doesn't have one
        if (! $profile->user_id) {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => 'Temporary User',
                'email' => 'temp-'.$sessionId.'@famlink.temp',
                'password' => Hash::make(Str::random(16)),
            ]);
            $user->assignRole('temporary');
            $profile->user_id = $user->id;
            $profile->save();
        }

        $answers = $profile->answers;

        // Load questions to find next one
        $questions = $this->loadQuestions();
        $questionList = $questions['questions'] ?? [];
        $nextQuestion = null;
        foreach ($questionList as $q) {
            if (! isset($answers[$q['key']])) {
                $nextQuestion = $q;
                break;
            }
        }

        // If no more questions, return completion
        if ($nextQuestion === null) {
            return response()->json([
                'success' => true,
                'answers' => $answers,
                'completed' => true,
                'message' => 'Tak for dine svar! Du er nu klar til at bruge Famlink.',
            ]);
        }

        // Stream the next question response
        return $this->streamAgentResponse($sessionId, $nextQuestion, $answers, $questionList);
    }

    /**
     * Stream agent response for onboarding question
     */
    protected function streamAgentResponse(string $sessionId, array $question, array $answers, array $allQuestions, bool $isResumed = false)
    {
        return response()->stream(function () use ($sessionId, $question, $answers, $allQuestions, $isResumed) {
            try {
                $agent = new OnboardingAgent;

                // Create context with session data
                $context = new AgentContext($sessionId);
                $context->setState('current_question', $question);
                $context->setState('answers', $answers);
                $context->setState('is_resumed', $isResumed);
                $context->setState('progress', [
                    'answered' => count($answers),
                    'total' => count($allQuestions),
                    'current' => $question['key'],
                ]);

                // Build conversation history
                $messages = [];

                // Add system context
                $messages[] = [
                    'role' => 'system',
                    'content' => "Du er Famlinks onboarding-assistent. Brugeren skal besvare spørgsmål {$question['key']} ud af ".count($allQuestions).'. Stil spørgsmålet på en empatisk måde.',
                ];

                // Add previous answers as context
                if (! empty($answers)) {
                    $messages[] = [
                        'role' => 'system',
                        'content' => 'Tidligere svar: '.json_encode($answers, JSON_UNESCAPED_UNICODE),
                    ];
                }

                // Add resumption context if this is a resumed session
                if ($isResumed) {
                    $messages[] = [
                        'role' => 'system',
                        'content' => 'Dette er en genoptaget samtale. Brugeren har tidligere besvaret nogle spørgsmål og vender nu tilbage. Vær venlig og hjælpsom, og fortsæt hvor I slap.',
                    ];
                }

                // Add the current question
                $messages[] = [
                    'role' => 'user',
                    'content' => "Stil spørgsmål {$question['key']}: {$question['text']}",
                ];

                // Get agent response - handle both streaming and non-streaming
                $prompt = "Du er Famlinks onboarding-assistent. Stil spørgsmål {$question['key']} på en empatisk og støttende måde: {$question['text']}";
                $response = $agent->execute($prompt, $context);

                // Send initial data
                echo 'data: '.json_encode([
                    'type' => 'start',
                    'question' => $question,
                    'answers' => $answers,
                    'session_id' => $sessionId,
                    'completed' => false,
                    'is_resumed' => $isResumed,
                ])."\n\n";
                ob_flush();
                flush();

                // Check if response is a generator (streaming) or string (non-streaming)
                if ($response instanceof \Generator) {
                    // Handle streaming response
                    $fullResponse = '';
                    foreach ($response as $chunk) {
                        if (isset($chunk['content'])) {
                            $fullResponse .= $chunk['content'];
                            echo 'data: '.json_encode([
                                'type' => 'chunk',
                                'content' => $chunk['content'],
                            ])."\n\n";
                            ob_flush();
                            flush();
                        }
                    }

                    // Send completion
                    echo 'data: '.json_encode([
                        'type' => 'complete',
                        'full_response' => $fullResponse,
                        'question' => $question,
                        'answers' => $answers,
                        'session_id' => $sessionId,
                        'is_resumed' => $isResumed,
                    ])."\n\n";
                    ob_flush();
                    flush();
                } else {
                    // Handle non-streaming response (fallback)
                    $fullResponse = is_string($response) ? $response : $question['text'];

                    // Send the full response as a single chunk
                    echo 'data: '.json_encode([
                        'type' => 'chunk',
                        'content' => $fullResponse,
                    ])."\n\n";
                    ob_flush();
                    flush();

                    // Send completion
                    echo 'data: '.json_encode([
                        'type' => 'complete',
                        'full_response' => $fullResponse,
                        'question' => $question,
                        'answers' => $answers,
                        'session_id' => $sessionId,
                        'is_resumed' => $isResumed,
                    ])."\n\n";
                    ob_flush();
                    flush();
                }

            } catch (\Exception $e) {
                \Log::error('OnboardingAgent streaming error', [
                    'error' => $e->getMessage(),
                    'session_id' => $sessionId,
                    'question_key' => $question['key'],
                ]);

                // Send error and fallback
                echo 'data: '.json_encode([
                    'type' => 'error',
                    'message' => 'Der opstod en fejl. Her er spørgsmålet:',
                    'fallback' => $question['text'],
                    'question' => $question,
                    'answers' => $answers,
                    'session_id' => $sessionId,
                    'is_resumed' => $isResumed,
                ])."\n\n";
                ob_flush();
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Headers' => 'Cache-Control',
        ]);
    }

    /**
     * Load onboarding questions from playbook file.
     */
    protected function loadQuestions(): array
    {
        $questions = [];
        $playbook = storage_path('app/onboarding_playbook.json');
        if (file_exists($playbook)) {
            $json = file_get_contents($playbook);
            $data = json_decode($json, true) ?? [];
            $questions = $data;
        }

        return $questions;
    }

    /**
     * Approve a user (change role from temporary to approved)
     */
    public function approveUser(Request $request, string $userId)
    {
        $user = User::findOrFail($userId);

        if ($user->hasRole('temporary')) {
            $user->removeRole('temporary');
            $user->assignRole('approved');

            return response()->json([
                'success' => true,
                'message' => 'User approved successfully',
                'user' => $user,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'User is not in temporary status',
        ], 400);
    }
}
