<?php

namespace App\Agents;

use Illuminate\Support\Facades\Log;
use Vizra\VizraADK\Agents\BaseLlmAgent;
use Vizra\VizraADK\System\AgentContext;

class OnboardingAgent extends BaseLlmAgent
{
    protected string $name = 'onboarding_agent';

    protected ?string $provider = 'gemini';

    protected string $model = 'gemini-1.5-flash';

    protected ?float $temperature = 0.7;

    protected bool $includeConversationHistory = true;
    // protected string $model = 'gemini-2.5-flash-lite';
    // protected string $model = 'openai/gpt-4-turbo';

    protected string $description = 'Famlink Onboarding Agent that guides users through personalized onboarding questions from a playbook.';

    /**
     * Agent instructions hierarchy (first found wins):
     * 1. Runtime: $agent->setPromptOverride('...')
     * 2. Database: agent_prompt_versions table (if enabled)
     * 3. File: resources/prompts/onboarding_agent/default.blade.php
     * 4. Fallback: This property
     *
     * Using fallback instructions to avoid Blade template issues
     */
    protected string $instructions = 'Du er Famlinks onboarding-assistent, der hjælper nye brugere med at komme godt om bord.

VIGTIGT: Du skal ALTID guide brugeren gennem alle spørgsmålene i playbooken i rækkefølge.

RETNINGSLINJER:
- Sig hej, byd velkommen og introducer dig selv KUN ved det allerførste spørgsmål
- Hvis brugerens svar er længere end et par ord, så forstå svaret, vær empatisk og støttende
- Kommuniker på dansk
- Hvis brugeren afviger, før du har stillet alle spørgsmål, forsøg at bringe samtalen tilbage til det næste spørgsmål
- Hvis brugeren siger "spring over" eller lignende, skal du respektere det og gå videre til næste spørgsmål
- Hvis brugeren siger "afslut" eller lignende, skal du afslutte onboarding-processen høfligt og informere dem om, at de altid kan starte forfra senere';

    protected bool $stream = true;

    protected array $tools = [
        // Add tools if needed for onboarding
    ];

    public function beforeLlmCall(array $inputMessages, AgentContext $context): array
    {
        Log::info('OnboardingAgent beforeLlmCall', ['session_id' => $context->getSessionId()]);

        // Check for custom instructions from context
        $customInstructions = $context->getState('custom_instructions');
        if ($customInstructions) {
            // Replace the system message with custom instructions
            if (!empty($inputMessages) && isset($inputMessages[0]['role']) && $inputMessages[0]['role'] === 'system') {
                $inputMessages[0]['content'] = $customInstructions;
            }
        }

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

        // Handle resumed sessions
        $isResumed = $context->getState('is_resumed', false);
        if ($isResumed) {
            Log::info('Handling resumed onboarding session', ['session_id' => $context->getSessionId()]);
        }

        return parent::beforeLlmCall($inputMessages, $context);
    }

    /**
     * Override getPrompt to avoid Blade template issues
     */
    public function getPrompt(?AgentContext $context = null): string
    {
        return $this->instructions;
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
}
