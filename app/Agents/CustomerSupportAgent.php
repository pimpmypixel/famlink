<?php

namespace App\Agents;

use App\Tools\TimelineTool;
use Log;
use Prism\Prism\Text\PendingRequest;
use Vizra\VizraADK\Agents\BaseLlmAgent;
use Vizra\VizraADK\System\AgentContext;

// use App\Tools\YourTool; // Example: Import your tool

class CustomerSupportAgent extends BaseLlmAgent
{
    protected string $name = 'customer_support';

    protected string $description = 'Famlink AI Assistant that helps users with common questions and issues';

    /**
     * Agent instructions hierarchy (first found wins):
     * 1. Runtime: $agent->setPromptOverride('...')
     * 2. Database: agent_prompt_versions table (if enabled)
     * 3. File: resources/prompts/customer_support_agent/default.blade.php
     * 4. Fallback: This property
     *
     * The prompt file has been created for you at:
     * resources/prompts/customer_support_agent/default.blade.php
     */
    protected string $instructions = 'Du er en sagsbehandler for forældre der har et igangværende forløb hos Familieretshuset.
        Vigtige oplysninger om produktet:
        - Du kan hjælpe med spørgsmål om begivenheder i din timeline.
        - Hvis et uuid er nævnt, så er det et user_id for begivenheder i timelineitems. Brug TimelineTool til at slå op i timelineitems.


        Vær høflig og hjælpsom. Hvis du ikke ved noget, så vær ærlig omkring det.';

    // protected string $model = 'gemini-1.5-flash';
    protected string $model = 'gemini-2.5-flash-lite'; // 'gemini-1.5-flash';

    protected bool $stream = true;

    protected array $tools = [
        TimelineTool::class,
    ];

    public function beforeLlmCall(array $inputMessages, AgentContext $context): array
    {
        Log::info('CustomerSupportAgent beforeLlmCall', ['session_id' => $context->getSessionId()]);

        // $context->setState('user_id', value: $context->getSessionId());
        // $inputMessages[] = ['role' => 'system', 'content' => 'Du er også lystfisker og elsker at fiske store tun.'];
        return parent::beforeLlmCall($inputMessages, $context);
    }

    /*
    public function afterLlmResponse(mixed $response, AgentContext $context, ?PendingRequest $request = null): mixed {

         return parent::afterLlmResponse($response, $context, $request);

    }

    public function beforeToolCall(string $toolName, array $arguments, AgentContext $context): array {

        return parent::beforeToolCall($toolName, $arguments, $context);

    }

    public function afterToolResult(string $toolName, string $result, AgentContext $context): string {

        return parent::afterToolResult($toolName, $result, $context);

    } */
}
