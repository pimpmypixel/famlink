<?php

namespace App\Agents;

use Prism\Prism\Text\PendingRequest;
use Vizra\VizraADK\Agents\BaseLlmAgent;
use Vizra\VizraADK\Contracts\ToolInterface;
use Vizra\VizraADK\System\AgentContext;
use App\Tools\TimelineTool;
// use App\Tools\YourTool; // Example: Import your tool

class CustomerSupportAgent extends BaseLlmAgent
{
    protected array $mcpServers = ['postgres'];
    protected string $name = 'customer_support';
    protected string $description = 'AcmeApp customer support agent that assists users with common questions and issues';

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

    protected string $instructions = "Du er en sagsbehandler for forældre der har et igangværende forløb hos Familieretshuset.

        Vigtige oplysninger om produktet:
        - Du kan hjælpe med spørgsmål om begivenheder i din timeline.
        - Hvis et uuid er nævnt, så er det et user_id for begivenheder i timelineitems. Brug TimelineTool til at slå op i timelineitems.


        Vær høflig og hjælpsom. Hvis du ikke ved noget, så vær ærlig omkring det.";

       /*  protected string $instructions = "Du er en sagsbehandler for forældre, der bruger Famlink til at holde styr på deres families vigtige begivenheder og minder.
        Key product information:
        - AcmeApp is a project management tool for teams
        - Pricing: Free for up to 5 users, $10/user/month for larger teams
        - Features: Task management, team collaboration, time tracking, reporting
        - Integrations: Slack, GitHub, Google Calendar

        Be friendly, concise, and always try to be helpful. If you don't know
        something, be honest about it."; */
    protected string $model = 'gemini-1.5-flash';
    protected bool $stream = true;

    protected array $tools = [
        TimelineTool::class
    ];

    /*

    Optional hook methods to override:

    public function beforeLlmCall(array $inputMessages, AgentContext $context): array
    {
        // $context->setState('custom_data_for_llm', 'some_value');
        // $inputMessages[] = ['role' => 'system', 'content' => 'Additional system note for this call.'];
        return parent::beforeLlmCall($inputMessages, $context);
    }

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
