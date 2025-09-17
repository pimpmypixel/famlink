<?php

namespace App\Tools;

use Vizra\VizraADK\Contracts\ToolInterface;
use Vizra\VizraADK\Memory\AgentMemory;
use Vizra\VizraADK\System\AgentContext;

use App\Models\TimelineItem;

class TimelineTool implements ToolInterface
{
    /**
     * Get the tool's definition for the LLM.
     * This structure should be JSON schema compatible.
     */
    public function definition(): array
    {
        return [
            'name' => 'timeline_lookup',
            'description' => 'Use this tool to lookup information in the timelineitems table',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'user_id' => [
                        'type' => 'string',
                        'description' => 'The uuid of the user whose timelineitems content to retrieve.'
                    ],
                ],
                // 'required' => ['example_param'],
            ],
        ];
    }

    /**
     * Execute the tool's logic.
     *
     * @param array $arguments Arguments provided by the LLM, matching the parameters defined above.
     * @param AgentContext $context The current agent context, providing access to session state etc.
     * @return string JSON string representation of the tool's result.
     */
    public function execute(array $arguments, AgentContext $context, AgentMemory $memory): string
    {
        // Access arguments: $location = $arguments['location'] ?? null;
         $sessionId = $context->getSessionId();
        // Access state: $previousValue = $context->getState('some_key');
        // dd($sessionId, $arguments);

        // Query timeline messages
        $query = TimelineItem::query();

        // Optionally filter by user_id, date, category_id if provided in $arguments
        if (isset($arguments['user_id'])) {
            $query->where('user_id', $arguments['user_id']);
        }
        if (isset($arguments['date'])) {
            $query->whereDate('date', $arguments['date']);
        }
        if (isset($arguments['category_id'])) {
            $query->where('category_id', $arguments['category_id']);
        }

        $items = $query->orderByDesc('item_timestamp')
            ->limit(20)
            ->get(['id', 'user_id', 'title', 'content', 'date', 'item_timestamp', 'category_id']);

        $result = [
            'status' => 'success',
            'items' => $items->toArray(),
        ];

        return json_encode($result);
    }
}
