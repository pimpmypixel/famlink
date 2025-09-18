<?php

namespace App\Http\Controllers;

use App\Agents\OnboardingAgent;
use App\Models\Profile;
use Illuminate\Http\Request;
use Vizra\VizraADK\System\AgentContext;

class OnboardingController extends Controller
{
    /**
     * Get the next onboarding question for the session with streaming.
     */
    public function getQuestion(Request $request)
    {
        $sessionId = $request->input('session_id') ?: uniqid('onboarding_', true);

        // Find profile for this session
        $profile = Profile::where('session_id', $sessionId)->first();
        $answers = $profile ? $profile->answers : [];

        // Load questions from playbook
        $questions = $this->loadQuestions();
        $questionList = $questions['questions'] ?? [];

        // Find next unanswered question
        $nextQuestion = null;
        foreach ($questionList as $q) {
            if (! isset($answers[$q['id']])) {
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
        return $this->streamAgentResponse($sessionId, $nextQuestion, $answers, $questionList);
    }

    /**
     * Submit an answer for the current question (non-streaming).
     */
    public function submitAnswer(Request $request)
    {
        $sessionId = $request->input('session_id') ?: uniqid('onboarding_', true);
        $questionId = $request->input('question_id');
        $answer = $request->input('answer');

        if (! $questionId || $answer === null) {
            return response()->json(['error' => 'Missing question_id or answer'], 422);
        }

        // Find or create profile for this session
        $profile = Profile::firstOrCreate(
            ['session_id' => $sessionId],
            ['answers' => []]
        );

        $answers = $profile->answers;
        $answers[$questionId] = $answer;
        $profile->answers = $answers;
        $profile->save();

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
        // Find profile for this session
        $profile = Profile::where('session_id', $sessionId)->first();
        $answers = $profile ? $profile->answers : [];

        // Load questions to find next one
        $questions = $this->loadQuestions();
        $questionList = $questions['questions'] ?? [];
        $nextQuestion = null;
        foreach ($questionList as $q) {
            if (! isset($answers[$q['id']])) {
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
    protected function streamAgentResponse(string $sessionId, array $question, array $answers, array $allQuestions)
    {
        return response()->stream(function () use ($sessionId, $question, $answers, $allQuestions) {
            try {
                $agent = new OnboardingAgent;

                // Create context with session data
                $context = new AgentContext($sessionId);
                $context->setState('current_question', $question);
                $context->setState('answers', $answers);
                $context->setState('progress', [
                    'answered' => count($answers),
                    'total' => count($allQuestions),
                    'current' => $question['id'],
                ]);

                // Build conversation history
                $messages = [];

                // Add system context
                $messages[] = [
                    'role' => 'system',
                    'content' => "Du er Famlinks onboarding-assistent. Brugeren skal besvare spørgsmål {$question['id']} ud af ".count($allQuestions).'. Stil spørgsmålet på en empatisk måde.',
                ];

                // Add previous answers as context
                if (! empty($answers)) {
                    $messages[] = [
                        'role' => 'system',
                        'content' => 'Tidligere svar: '.json_encode($answers, JSON_UNESCAPED_UNICODE),
                    ];
                }

                // Add the current question
                $messages[] = [
                    'role' => 'user',
                    'content' => "Stil spørgsmål {$question['id']}: {$question['text']}",
                ];

                // Get agent response - handle both streaming and non-streaming
                $prompt = "Du er Famlinks onboarding-assistent. Stil spørgsmål {$question['id']} på en empatisk og støttende måde: {$question['text']}";
                $response = $agent->execute($prompt, $context);

                // Send initial data
                echo 'data: '.json_encode([
                    'type' => 'start',
                    'question' => $question,
                    'answers' => $answers,
                    'session_id' => $sessionId,
                    'completed' => false,
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
                    ])."\n\n";
                    ob_flush();
                    flush();
                }

            } catch (\Exception $e) {
                \Log::error('OnboardingAgent streaming error', [
                    'error' => $e->getMessage(),
                    'session_id' => $sessionId,
                    'question_id' => $question['id'],
                ]);

                // Send error and fallback
                echo 'data: '.json_encode([
                    'type' => 'error',
                    'message' => 'Der opstod en fejl. Her er spørgsmålet:',
                    'fallback' => $question['text'],
                    'question' => $question,
                    'answers' => $answers,
                    'session_id' => $sessionId,
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
}
