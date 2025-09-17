<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Vizra\VizraADK\Models\AgentMessage;
use Vizra\VizraADK\Models\AgentSession;

class VizraAgentController extends Controller
{
    /**
     * Get chat messages for a specific agent and authenticated user.
     */
    public function getMessages(Request $request, string $agentName): \Illuminate\Http\JsonResponse
    {
        // Check if user is authenticated
        if (! Auth::check()) {
            return response()->json(['error' => 'Authentication required'], 401);
        }

        $user = Auth::user();

        try {
            // Note: Vizra ADK currently stores user_id as null in sessions
            // For now, we'll fetch all sessions for the agent and filter by user later if needed
            // TODO: Configure Vizra ADK to properly associate sessions with authenticated users
            $sessions = AgentSession::where('agent_name', $agentName)
                ->get();

            logger()->info("VizraAgentController: Found {$sessions->count()} sessions for agent '{$agentName}'", [
                'user_id' => $user->id,
                'sessions_with_null_user_id' => $sessions->where('user_id', null)->count(),
                'sessions_with_user_id' => $sessions->whereNotNull('user_id')->count(),
            ]);

            if ($sessions->isEmpty()) {
                return response()->json(['messages' => []]);
            }

            $sessionIds = $sessions->pluck('id');

            // Get all messages from these sessions, ordered by creation time
            $messages = AgentMessage::whereIn('agent_session_id', $sessionIds)
                ->where('role','!=', 'tool') // Only include user messages for privacy
                ->orderBy('created_at', 'asc')
                ->get(['role', 'content', 'created_at'])
                ->map(function ($message) {
                    return [
                        'role' => $message->role,
                        'content' => $message->content,
                        'timestamp' => $message->created_at->toISOString(),
                    ];
                });

            return response()->json([
                'messages' => $messages,
                'total_sessions' => $sessions->count(),
                'note' => 'Currently showing all messages for this agent. User-specific filtering may be limited due to Vizra ADK configuration.',
            ]);

        } catch (\Throwable $e) {
            logger()->error("Error fetching messages for agent '{$agentName}': ".$e->getMessage(), ['exception' => $e]);

            return response()->json(['error' => 'Failed to fetch messages', 'detail' => $e->getMessage()], 500);
        }
    }
}
