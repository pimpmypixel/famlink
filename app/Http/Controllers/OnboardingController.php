<?php

namespace App\Http\Controllers;

use App\Agents\OnboardingAgent;
use App\Models\Profile;
use Illuminate\Http\Request;
use Vizra\VizraADK\System\AgentContext;

class OnboardingController extends Controller
{
    /**
     * Get the next onboarding question for the session.
     */
    public function getQuestion(Request $request)
    {
        $sessionId = $request->session()->getId();

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

        // Use the agent to generate a personalized response
        $agentResponse = $this->getAgentResponse($sessionId, $nextQuestion, $answers, $questionList);

        return response()->json([
            'question' => $nextQuestion,
            'agent_message' => $agentResponse,
            'answers' => $answers,
            'session_id' => $sessionId,
            'completed' => false,
        ]);
    }

    /**
     * Submit an answer for the current question.
     */
    public function submitAnswer(Request $request)
    {
        $sessionId = $request->session()->getId();
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

        $response = [
            'success' => true,
            'answers' => $answers,
            'completed' => $nextQuestion === null,
        ];

        // If there's a next question, get agent response for it
        if ($nextQuestion) {
            $agentResponse = $this->getAgentResponse($sessionId, $nextQuestion, $answers, $questionList);
            $response['next_question'] = $nextQuestion;
            $response['agent_message'] = $agentResponse;
        } else {
            $response['message'] = 'Tak for dine svar! Du er nu klar til at bruge Famlink.';
        }

        return response()->json($response);
    }

    /**
     * Get a response from the OnboardingAgent
     */
    protected function getAgentResponse(string $sessionId, array $question, array $answers, array $allQuestions): string
    {
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

            // Get agent response
            $prompt = "Du er Famlinks onboarding-assistent. Stil spørgsmål {$question['id']} på en empatisk og støttende måde: {$question['text']}";
            $response = $agent->execute($prompt, $context);

            return is_string($response) ? $response : $question['text'];

        } catch (\Exception $e) {
            // Fallback to direct question if agent fails
            \Log::error('OnboardingAgent error', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId,
                'question_id' => $question['id'],
            ]);

            return $question['text'];
        }
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
