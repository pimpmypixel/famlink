<?php

namespace App\Http\Controllers;

use App\Agents\OnboardingAgent;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Vizra\VizraADK\Execution\AgentExecutor;

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
        $questionList = $questions ?? [];

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
            // Send completion email if user exists and has email
            if ($profile->user && $profile->user->email) {
                $this->sendCompletionEmail($profile->user, $answers);
            }

            return response()->json([
                'question' => null,
                'answers' => $answers,
                'session_id' => $sessionId,
                'completed' => true,
                'message' => 'Tak for dine svar. Du vil snart modtage en email fra Famlink.',
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
            if ($questionKey === 'user_firstname') { // First name question
                $user->first_name = $answer;
                $user->save();
            } elseif ($questionKey === 'user_email') { // Email question
                // Check if email already exists
                $existingUser = User::where('email', $answer)->first();

                if ($existingUser) {
                    // If the existing user is also temporary, allow the merge
                    if ($existingUser->hasRole('temporary')) {
                        // Merge the temporary accounts - keep the current profile but update user
                        $oldUserId = $user->id;
                        $profile->user_id = $existingUser->id;
                        $profile->save();

                        // Delete the old temporary user
                        $user->delete();

                        // Update the existing temporary user with the new information
                        $existingUser->first_name = $profile->answers['user_firstname'] ?? $existingUser->first_name;
                        $existingUser->save();

                        // Update the user reference for the rest of this method
                        $user = $existingUser;
                    } else {
                        // Email belongs to a regular user - don't allow temporary user to claim it
                        return response()->json([
                            'error' => 'Denne email-adresse er allerede registreret. Brug venligst en anden email-adresse eller log ind med denne konto.',
                            'email_taken' => true,
                        ], 422);
                    }
                } else {
                    // Email is available, update the user
                    $user->email = $answer;
                    $user->save();
                }
            }
        }

        // Check if this completes the onboarding
        $questions = $this->loadQuestions();
        $questionList = $questions ?? [];
        $isCompleted = count($answers) >= count($questionList);

        if ($isCompleted && $user && $user->email) {
            // Send completion email
            $this->sendCompletionEmail($user, $answers);
        }

        return response()->json([
            'success' => true,
            'session_id' => $sessionId,
            'message' => 'Answer saved successfully',
            'completed' => $isCompleted,
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
        $questionList = $questions ?? [];
        $nextQuestion = null;
        foreach ($questionList as $q) {
            if (! isset($answers[$q['key']])) {
                $nextQuestion = $q;
                break;
            }
        }

        // If no more questions, return completion
        if ($nextQuestion === null) {
            // Send completion email if user exists and has email
            if ($profile->user && $profile->user->email) {
                $this->sendCompletionEmail($profile->user, $answers);
            }

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
                // Find or create profile for this session
                $profile = Profile::firstOrCreate(
                    ['session_id' => $sessionId],
                    ['answers' => []]
                );

                $user = $profile->user;

                // Determine if this is the first question ever for this session
                $isFirstQuestionEver = empty($answers);

                // Build instructions
                $instructions = $isFirstQuestionEver
                    ? "Du er Famlinks onboarding-assistent. Dette er det første spørgsmål nogensinde - sig hej, byd velkommen og introducer dig selv. Stil spørgsmålet på en empatisk måde. Brugeren skal besvare spørgsmål {$question['key']} ud af ".count($allQuestions).'.'
                    : "Du er Famlinks onboarding-assistent. Dette er ikke det første spørgsmål - stil kun spørgsmålet uden yderligere hilsener. Stil spørgsmålet på en empatisk måde. Brugeren skal besvare spørgsmål {$question['key']} ud af ".count($allQuestions).'.';

                // Add previous answers as context if available
                if (! empty($answers)) {
                    $instructions .= "\n\nTidligere svar: ".json_encode($answers, JSON_UNESCAPED_UNICODE);
                }

                // Add resumption context if this is a resumed session
                if ($isResumed) {
                    $instructions .= "\n\nDette er en genoptaget samtale. Brugeren har tidligere besvaret nogle spørgsmål og vender nu tilbage. Vær venlig og hjælpsom, og fortsæt hvor I slap.";
                }

                // Use AgentExecutor for proper persistence
                $executor = (new AgentExecutor(OnboardingAgent::class, "Stil spørgsmål {$question['key']}: {$question['text']}"))
                    ->forUser($user)
                    ->withSession($sessionId)
                    ->withContext([
                        'current_question' => $question,
                        'answers' => $answers,
                        'is_resumed' => $isResumed,
                        'progress' => [
                            'answered' => count($answers),
                            'total' => count($allQuestions),
                            'current' => $question['key'],
                        ],
                        'custom_instructions' => $instructions,
                    ]);

                // Execute the agent
                $response = $executor->go();

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
                Log::error('OnboardingAgent streaming error', [
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
            $questions = json_decode($json, true) ?? [];
            // The JSON file is a direct array of questions, so wrap it in the expected format
            // $questions = ['questions' => $data];
        }

        return $questions;
    }

    /**
     * Send completion email to user
     */
    protected function sendCompletionEmail(User $user, array $answers): void
    {
        try {
            // Generate signed verification URL (valid for 7 days)
            $verificationUrl = URL::temporarySignedRoute(
                'email.verify',
                now()->addDays(7),
                ['user' => $user->id]
            );

            Mail::send(
                'emails.onboarding-completion',
                [
                    'user' => $user,
                    'answers' => $answers,
                    'verificationUrl' => $verificationUrl,
                    'controller' => $this,
                ],
                function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Tak for din onboarding - Velkommen til Famlink!')
                        ->from(config('mail.from.address'), config('mail.from.name'));
                }
            );

            Log::info('Onboarding completion email sent', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send onboarding completion email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Get question text by key
     */
    protected function getQuestionTextByKey(string $key): ?string
    {
        $questions = $this->loadQuestions();
        $questionList = $questions ?? [];

        foreach ($questionList as $question) {
            if ($question['key'] === $key) {
                return $question['text'];
            }
        }

        return null;
    }
}
