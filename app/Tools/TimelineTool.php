<?php

namespace App\Tools;

use App\Models\TimelineItem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Vizra\VizraADK\Contracts\ToolInterface;
use Vizra\VizraADK\Memory\AgentMemory;
use Vizra\VizraADK\System\AgentContext;

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
            /* 'parameters' => [
                'type' => 'object',
                'properties' => [
                    'user_id' => [
                        'type' => 'string',
                        'description' => 'The uuid of the user whose timelineitems content to retrieve.'
                    ],
                ],
                // 'required' => ['example_param'],
            ], */
        ];
    }

    /**
     * Execute the tool's logic.
     *
     * @param  array  $arguments  Arguments provided by the LLM, matching the parameters defined above.
     * @param  AgentContext  $context  The current agent context, providing access to session state etc.
     * @return string JSON string representation of the tool's result.
     */
    public function execute(array $arguments, AgentContext $context, AgentMemory $memory): string
    {
        // Get the authenticated user ID from the context if available
        $authenticatedUserId = request()->user()?->id ?? $context->getState('authenticated_user_id') ?? auth()->id();

        // Get role-based access information from context
        $accessLevel = $context->getState('access_level', 'limited');
        $userRole = $context->getState('user_role');
        $familyId = $context->getState('family_id');
        $accessibleFamilyIds = $context->getState('accessible_family_ids', []);

        // Log::info('TimelineTool executed', [
        //     'arguments' => $arguments,
        //     'session_id' => $context->getSessionId(),
        //     'authenticated_user_id' => $authenticatedUserId,
        //     'access_level' => $accessLevel,
        //     'user_role' => $userRole
        // ]);

        // Query timeline messages with role-based filtering
        $query = TimelineItem::query();

        // Apply role-based access control
        switch ($accessLevel) {
            case 'global':
                // Admin can access everything
                // No additional filtering needed
                break;

            case 'family':
                // Authority can access their related families
                if (!empty($accessibleFamilyIds)) {
                    $query->whereIn('family_id', $accessibleFamilyIds);
                } else {
                    // Fallback: only their own family
                    $query->where('family_id', $familyId);
                }
                break;

            case 'private':
            default:
                // Parents and regular users can only access their own family's timeline
                if ($familyId) {
                    $query->where('family_id', $familyId);
                } elseif ($authenticatedUserId) {
                    // Fallback: filter by user's own items
                    $query->where('user_id', $authenticatedUserId);
                } else {
                    // No access
                    return json_encode([
                        'status' => 'error',
                        'message' => 'Ingen adgang til timeline data',
                        'items' => []
                    ]);
                }
                break;
        }

        // If we have an authenticated user ID and limited access, ensure they can only see relevant items
        if ($authenticatedUserId && $accessLevel !== 'global') {
            // For non-admin users, they should be able to see items from their family
            // The family filtering above should handle this
        }

        // Optionally filter by user_id, date, category_id if provided in $arguments
        if (isset($arguments['user_id'])) {
            // Only allow filtering by user_id if it matches the access rules
            $requestedUserId = $arguments['user_id'];

            if ($accessLevel === 'global') {
                // Admin can filter by any user
                $query->where('user_id', $requestedUserId);
            } elseif ($accessLevel === 'family') {
                // Authority can filter by users in their accessible families
                $userFamilyId = \App\Models\User::where('id', $requestedUserId)->value('family_id');
                if (in_array($userFamilyId, $accessibleFamilyIds)) {
                    $query->where('user_id', $requestedUserId);
                } else {
                    return json_encode([
                        'status' => 'error',
                        'message' => 'Ingen adgang til denne brugers timeline',
                        'items' => []
                    ]);
                }
            } else {
                // Regular users can only see their own items
                if ($requestedUserId === $authenticatedUserId) {
                    $query->where('user_id', $requestedUserId);
                } else {
                    return json_encode([
                        'status' => 'error',
                        'message' => 'Du kan kun se dine egne timeline-elementer',
                        'items' => []
                    ]);
                }
            }
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
            'access_level' => $accessLevel,
            'items' => $items->toArray(),
            'total_items' => $items->count(),
        ];

        return json_encode($result);
    }
}
