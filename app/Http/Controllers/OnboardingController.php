<?php

namespace App\Http\Controllers;

use App\Agents\OnboardingAgent;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Vizra\VizraADK\System\AgentContext;

class OnboardingController extends Controller
{
    /**
     * Get the next onboarding question for the session with streaming.
     */
    public function getQuestion(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('OnboardingController::getQuestion called', [
            'path' => $request->path(),
            'method' => $request->method(),
            'environment' => app()->environment(),
        ]);
        $sessionId = $request->input('session_id') ?: uniqid('onboarding_', true);
        $isResumed = (bool) $request->input('resumed', false);

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
                'message' => 'Tak for dine svar! Du er nu klar til at bruge Famlink.',
            ]);
        }

        // Use the agent to generate a personalized response with streaming
        // In testing or local development, return JSON directly instead of streaming
        if (app()->environment(['testing', 'local'])) {
            $response = [
                'question' => $nextQuestion,
                'answers' => $answers,
                'session_id' => $sessionId,
                'completed' => false,
                'is_resumed' => $isResumed,
            ];

            \Illuminate\Support\Facades\Log::info('Returning JSON response', ['response' => $response]);

            return response()->json($response);
        }

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
            if ($questionKey === 'name' || $questionKey === 'user_firstname') { // Name question
                $user->name = $answer;
                $user->save();
            } elseif ($questionKey === 'email' || $questionKey === 'user_email') { // Email question
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
                        $existingUser->name = $profile->answers['name'] ?? $existingUser->name;
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
        return response()->stream(function () use ($sessionId, $question, $answers, $isResumed) {
            try {
                // In testing mode, use fixed text from playbook instead of AI agent
                if (app()->environment(['testing', 'local'])) {
                    Log::info('Using fixed test response for question: '.$question['key']);

                    // Send initial data
                    echo 'data: '.json_encode([
                        'type' => 'start',
                        'question' => $question,
                        'answers' => $answers,
                        'session_id' => $sessionId,
                        'completed' => false,
                        'is_resumed' => $isResumed,
                    ], JSON_UNESCAPED_UNICODE)."\n\n";
                    ob_flush();
                    flush();

                    // Send the fixed question text as a single chunk
                    $questionText = $question['text'];
                    echo 'data: '.json_encode([
                        'type' => 'chunk',
                        'content' => $questionText,
                    ], JSON_UNESCAPED_UNICODE)."\n\n";
                    ob_flush();
                    flush();

                    // Send completion
                    echo 'data: '.json_encode([
                        'type' => 'complete',
                        'full_response' => $questionText,
                        'question' => $question,
                        'answers' => $answers,
                        'session_id' => $sessionId,
                        'is_resumed' => $isResumed,
                    ], JSON_UNESCAPED_UNICODE)."\n\n";
                    ob_flush();
                    flush();

                    return;
                }

                $agent = new OnboardingAgent;

                // Create context with session data
                $context = new AgentContext($sessionId);
                $context->setState('current_question', $question);
                $context->setState('answers', $answers);
                $context->setState('is_resumed', $isResumed);
                $context->setState('is_first_question', empty($answers));
                $context->setState('user_name', $answers['user_firstname'] ?? $answers['name'] ?? 'der');

                // Get agent response - handle both streaming and non-streaming
                $prompt = "Stil spørgsmålet på en empatisk måde: {$question['text']}";
                $response = $agent->execute($prompt, $context);

                // Send initial data
                echo 'data: '.json_encode([
                    'type' => 'start',
                    'question' => $question,
                    'answers' => $answers,
                    'session_id' => $sessionId,
                    'completed' => false,
                    'is_resumed' => $isResumed,
                ], JSON_UNESCAPED_UNICODE)."\n\n";
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
                            ], JSON_UNESCAPED_UNICODE)."\n\n";
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
                    ], JSON_UNESCAPED_UNICODE)."\n\n";
                    ob_flush();
                    flush();
                } else {
                    // Handle non-streaming response (fallback)
                    $fullResponse = is_string($response) ? $response : $question['text'];

                    // Send the full response as a single chunk
                    echo 'data: '.json_encode([
                        'type' => 'chunk',
                        'content' => $fullResponse,
                    ], JSON_UNESCAPED_UNICODE)."\n\n";
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
                    ], JSON_UNESCAPED_UNICODE)."\n\n";
                    ob_flush();
                    flush();
                }

            } catch (\Exception $e) {
                Log::error('OnboardingAgent streaming error', [
                    'error' => $e->getMessage(),
                    'session_id' => $sessionId,
                    'question_key' => $question['key'],
                ]);

                // Check if this is a rate limit error
                $isRateLimit = str_contains(strtolower($e->getMessage()), 'rate limit') ||
                              str_contains(strtolower($e->getMessage()), 'quota exceeded') ||
                              str_contains(strtolower($e->getMessage()), 'too many requests');

                // Send error and fallback
                echo 'data: '.json_encode([
                    'type' => 'error',
                    'message' => 'Der opstod en fejl. Her er spørgsmålet:',
                    'fallback' => $question['text'],
                    'question' => $question,
                    'answers' => $answers,
                    'session_id' => $sessionId,
                    'is_resumed' => $isResumed,
                    'is_rate_limit' => $isRateLimit,
                    'error_message' => $isRateLimit ? 'LLM API call failed: You hit a provider rate limit' : $e->getMessage(),
                ], JSON_UNESCAPED_UNICODE)."\n\n";
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
        // Use test playbook if in testing environment OR if running tests (check for test file existence)
        if (app()->environment('testing') || file_exists(resource_path('prompts/test-playbook.json'))) {
            Log::info('Loading test playbook - environment detected as testing or test file exists');
            $testPlaybook = resource_path('prompts/test-playbook.json');
            if (file_exists($testPlaybook)) {
                Log::info('Test playbook file exists at: '.$testPlaybook);
                $json = file_get_contents($testPlaybook);
                $data = json_decode($json, true);
                Log::info('Loaded test questions: '.count($data['questions'] ?? []));

                return $data['questions'] ?? [];
            } else {
                Log::error('Test playbook file not found at: '.$testPlaybook);
            }
        } else {
            Log::info('Not in testing environment, current env: '.app()->environment());
        }

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
            Mail::raw(
                $this->buildCompletionEmailContent($user, $answers),
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
     * Build completion email content
     */
    protected function buildCompletionEmailContent(User $user, array $answers): string
    {
        $name = $answers['name'] ?? $answers['user_firstname'] ?? $user->name ?? 'Bruger';

        return "Kære {$name},

Tak for at du har gennemført Famlinks onboarding! 🎉

Vi har modtaget dine svar og er glade for at byde dig velkommen til Famlink. Vi har noteret følgende oplysninger fra din onboarding:

".$this->formatAnswersForEmail($answers).'

Dit næste skridt:
- Log ind på Famlink for at begynde at bruge platformen
- Udforsk de forskellige funktioner, der kan hjælpe dig
- Kontakt os hvis du har spørgsmål

Vi håber, at Famlink kan være til gavn for dig og din situation.

Med venlig hilsen,
Famlink-teamet

---
Denne email blev sendt automatisk efter gennemført onboarding.';
    }

    /**
     * Format answers for email
     */
    protected function formatAnswersForEmail(array $answers): string
    {
        $formatted = '';
        foreach ($answers as $key => $answer) {
            $questionText = $this->getQuestionTextByKey($key);
            if ($questionText) {
                $formatted .= "- {$questionText}: {$answer}\n";
            }
        }

        return $formatted;
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
