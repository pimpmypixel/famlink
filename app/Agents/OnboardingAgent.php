<?php

namespace App\Agents;

use Illuminate\Support\Facades\Log;
use Vizra\VizraADK\Agents\BaseLlmAgent;
use Vizra\VizraADK\System\AgentContext;

class OnboardingAgent extends BaseLlmAgent
{
    protected string $name = 'onboarding_agent';

    // protected ?string $provider = 'gemini';
    protected ?string $provider = 'mistral';

    protected string $model = 'mistral-medium-2505';
    // protected string $model = 'gemini-2.5-flash-lite';
    // protected string $model = 'openai/gpt-4-turbo';

    protected ?float $temperature = 0.7;

    protected string $contextStrategy = 'recent'; // 'none', 'recent', 'full'

    protected int $historyLimit = 5; // last 10 messages (for 'recent' strategy)

    protected bool $includeConversationHistory = true;

    protected string $description = 'Famlink Onboarding Agent that guides users through personalized onboarding questions from a playbook.';

    /**
     * Agent instructions hierarchy (first found wins):
     * 1. Runtime: $agent->setPromptOverride('...')
     * 2. Database: agent_prompt_versions table (if enabled)
     * 3. File: resources/prompts/onboarding_agent/default.blade.php
     * 4. Fallback: This property
     *
     * Using dynamic prompt building instead of Blade template for better compatibility
     */
    protected string $instructions = 'Du er Famlinks onboarding-assistent.';

    /**
     * Get the dynamic prompt based on context
     */
    protected function getPrompt(): string
    {
        $context = $this->context;
        if (! $context) {
            return 'Du er Famlinks onboarding-assistent. Stil spørgsmålet på en empatisk måde.';
        }

        $currentQuestion = $context->getState('current_question');
        $isFirstQuestion = $context->getState('is_first_question', true);
        $userName = $context->getState('user_name', 'der');

        $prompt = "Du er Famlinks onboarding-assistent.\n\n";

        if ($isFirstQuestion) {
            $prompt .= "Hej {$userName}, jeg er Famlinks onboarding-assistent, og jeg er her for at hjælpe dig med at komme godt i gang.\n\n";
        }

        if ($currentQuestion) {
            $prompt .= "Stil følgende spørgsmål på en empatisk og støttende måde: {$currentQuestion['text']}\n\n";
            $prompt .= 'Svar KUN med spørgsmålet - ingen yderligere instruktioner eller forklaringer.';
        }

        return $prompt;
    }

    /*
    protected string $temp = '
         Playbook spørgsmål:
         1. Hej 👋 Først vil jeg gerne høre dit fornavn, så vi kan tilpasse oplevelsen til dig.
         2. Hvad er din e-mailadresse?
         3. Vil du fortælle mig, om du er mor eller far?
         4. Hvad er din nuværende boligsituation? (fx bor alene, med børnene, deleordning, sammen med ny partner)
         5. Hvor mange børn har du, og hvor gamle er de?
         6. Hvordan ser samværsordningen ud lige nu? (fx 7/7, weekend-ordning, ingen aftale endnu)
         7. Hvordan vil du beskrive kommunikationen med den anden forælder på nuværende tidspunkt? (fx god, udfordret, ingen kontakt)
         8. Er der en igangværende sag i Familieretshuset eller ved en myndighed?
         9. Hvordan oplever du samarbejdet med sagsbehandlere eller myndigheder indtil nu?
         10. Hvilke kanaler bruger du oftest til at kommunikere med den anden forælder? (fx sms, e-mail, telefon, messenger)
         11. Føler du, at du har overblik over vigtige aftaler og hændelser i jeres forløb lige nu?
         12. Hvor stort et behov oplever du for at dokumentere hændelser og kommunikation? (fx lavt, moderat, højt)
         13. Hvad er det vigtigste for dig at få ud af at bruge Famlink? (fx ro og overblik, bedre kommunikation, styr på dokumentation)
         14. Hvordan vil du beskrive dit nuværende overskud i hverdagen? (fx godt overskud, nogenlunde, presset)
         15. Vil du gerne have, at Famlink sender dig påmindelser om aftaler, deadlines eller dokumentation?
         16. Er der noget særligt, du synes vi skal vide om din situation, som kan hjælpe os med at støtte dig bedst muligt?'; */

    protected bool $stream = true;

    protected array $tools = [
        // Add tools if needed for onboarding
    ];

    public function beforeLlmCall(array $inputMessages, AgentContext $context): array
    {
        Log::info('OnboardingAgent beforeLlmCall', ['session_id' => $context->getSessionId()]);

        // Load playbook data and add it to context
        $playbookData = $this->loadPlaybookData();
        if ($playbookData) {
            $context->setState('playbook', $playbookData);

            // Initialize with first question if not already set
            $allState = $context->getAllState();
            if (! isset($allState['current_question'])) {
                $firstQuestion = $playbookData[0] ?? null;
                if ($firstQuestion) {
                    $context->setState('current_question', $firstQuestion);
                    $context->setState('progress', [
                        'answered' => 0,
                        'total' => count($playbookData),
                        'current' => $firstQuestion['key'],
                    ]);
                    $context->setState('answers', []);
                }
            }
        }

        // Set context variables for the Blade template
        $progress = $context->getState('progress', ['answered' => 0, 'total' => 16]);
        $currentQuestion = $context->getState('current_question');
        $answers = $context->getState('answers', []);

        // Set template variables directly in context state
        // Note: is_first_question is already set by the controller
        $context->setState('user_name', $answers['user_firstname'] ?? null);
        $context->setState('current_question', $currentQuestion);
        $context->setState('question_number', ($progress['answered'] ?? 0) + 1);
        $context->setState('total_questions', $progress['total'] ?? 16);
        $context->setState('previous_answers', $answers);

        // Handle resumed sessions
        $isResumed = $context->getState('is_resumed', false);
        if ($isResumed) {
            Log::info('Handling resumed onboarding session', ['session_id' => $context->getSessionId()]);
        }

        return parent::beforeLlmCall($inputMessages, $context);
    }

    /**
     * Load onboarding playbook data
     */
    protected function loadPlaybookData(): ?array
    {
        $playbookPath = storage_path('app/onboarding_playbook.json');

        if (! file_exists($playbookPath)) {
            Log::warning('Onboarding playbook file not found', ['path' => $playbookPath]);

            return null;
        }

        $json = file_get_contents($playbookPath);
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Failed to parse onboarding playbook JSON', [
                'error' => json_last_error_msg(),
                'path' => $playbookPath,
            ]);

            return null;
        }

        return $data;
    }

    /**
     * Override getInstructions to use dynamic prompt building instead of Blade template
     */
    public function getInstructions(): string
    {
        // Use the dynamic prompt method instead of file-based prompts
        return $this->getPrompt();
    }
}
