<?php

namespace App\Agents;

use Illuminate\Support\Facades\Log;
use Vizra\VizraADK\Agents\BaseLlmAgent;
use Vizra\VizraADK\System\AgentContext;

class OnboardingAgent extends BaseLlmAgent
{
    protected string $name = 'onboarding_agent';

    protected ?string $provider = 'mistral';

    protected string $model = 'ministral-8b-2410';

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
        16. Er der noget særligt, du synes vi skal vide om din situation, som kan hjælpe os med at støtte dig bedst muligt?';

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
