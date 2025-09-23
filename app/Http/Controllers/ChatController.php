<?php

namespace App\Http\Controllers;

use App\Agents\CustomerSupportAgent;
use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Vizra\VizraADK\Execution\AgentExecutor;

class ChatController extends Controller
{
    /**
     * Handle chat message for approved users with role-based access.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|string',
        ]);

        $user = Auth::user();
        $message = $request->input('message');
        $sessionId = $request->input('session_id') ?: 'chat_' . $user->id . '_' . now()->timestamp;

        // Check for onboarding session continuity
        $sessionId = $this->handleSessionContinuity($user, $sessionId);

        try {
            // Determine agent based on user role
            $agentClass = $this->getAgentClassForUser($user);

            // Use AgentExecutor for proper persistence
            $executor = (new AgentExecutor($agentClass, $message))
                ->forUser($user)
                ->withSession($sessionId)
                ->withContext([
                    'authenticated_user_id' => $user->id,
                    'user_role' => $user->getRoleNames()->first(),
                    'family_id' => $user->family_id,
                ]);

            // Add role-specific context
            $this->addRoleContextToExecutor($executor, $user);

            // Execute agent
            $response = $executor->go();

            // Handle streaming response
            if ($response instanceof \Generator) {
                return response()->stream(function () use ($response, $sessionId, $user) {
                    $fullResponse = '';
                    foreach ($response as $chunk) {
                        if (isset($chunk['content'])) {
                            $fullResponse .= $chunk['content'];
                            echo 'data: ' . json_encode([
                                'type' => 'chunk',
                                'content' => $chunk['content'],
                            ]) . "\n\n";
                            ob_flush();
                            flush();
                        }
                    }

                    echo 'data: ' . json_encode([
                        'type' => 'complete',
                        'full_response' => $fullResponse,
                        'session_id' => $sessionId,
                    ]) . "\n\n";
                    ob_flush();
                    flush();
                }, 200, [
                    'Content-Type' => 'text/event-stream',
                    'Cache-Control' => 'no-cache',
                    'Connection' => 'keep-alive',
                ]);
            }

            // Handle non-streaming response
            return response()->json([
                'response' => is_string($response) ? $response : 'Jeg forstår ikke din besked. Kan du prøve igen?',
                'session_id' => $sessionId,
            ]);

        } catch (\Exception $e) {
            Log::error('Chat message error', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'role' => $user->getRoleNames()->first(),
            ]);

            // Show detailed error for admin users
            if ($user->hasRole('admin')) {
                return response()->json([
                    'error' => 'Chat fejl: ' . $e->getMessage(),
                    'details' => $e->getTraceAsString(),
                ], 500);
            }

            return response()->json([
                'error' => 'Der opstod en fejl med chatten. Prøv igen senere.',
            ], 500);
        }
    }

    /**
     * Get messages history for the user.
     */
    public function getMessages(Request $request)
    {
        $user = Auth::user();
        $sessionId = $request->input('session_id') ?: 'chat_' . $user->id . '_' . now()->timestamp;

        try {
            // Get messages from Vizra ADK based on user role
            $messages = $this->getMessagesForUser($user, $sessionId);

            return response()->json([
                'messages' => $messages,
                'session_id' => $sessionId,
            ]);

        } catch (\Exception $e) {
            Log::error('Get messages error', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            if ($user->hasRole('admin')) {
                return response()->json([
                    'error' => 'Fejl ved hentning af beskeder: ' . $e->getMessage(),
                    'details' => $e->getTraceAsString(),
                ], 500);
            }

            return response()->json([
                'error' => 'Kunne ikke hente beskeder.',
            ], 500);
        }
    }

    /**
     * Handle session continuity from onboarding to approved user chat.
     */
    private function handleSessionContinuity(User $user, string $sessionId): string
    {
        // Check if user has a profile with onboarding session
        $profile = $user->profile;
        if ($profile && $profile->session_id) {
            // Check if the onboarding session is completed
            $questions = $this->loadOnboardingQuestions();
            $totalQuestions = count($questions);
            $answersCount = count($profile->answers ?? []);

            if ($answersCount >= $totalQuestions) {
                // Onboarding completed, create continuity link
                // Use a derived session ID that maintains context
                return 'approved_' . $profile->session_id . '_' . $user->id;
            }
        }

        return $sessionId;
    }

    /**
     * Load onboarding questions (simplified version).
     */
    private function loadOnboardingQuestions(): array
    {
        // This should match the OnboardingController's loadQuestions method
        $questions = [];
        $playbook = storage_path('app/onboarding_playbook.json');
        if (file_exists($playbook)) {
            $json = file_get_contents($playbook);
            $questions = json_decode($json, true) ?? [];
        }
        return $questions;
    }

    /**
     * Get the appropriate agent class based on user role.
     */
    private function getAgentClassForUser(User $user): string
    {
        // All approved users use CustomerSupportAgent for now
        // Could be extended to use different agents based on role
        return CustomerSupportAgent::class;
    }

    /**
     * Add role-specific context to the agent executor.
     */
    private function addRoleContextToExecutor(AgentExecutor $executor, User $user): void
    {
        $role = $user->getRoleNames()->first();

        $contextData = [];

        switch ($role) {
            case 'admin':
                // Admin can access everything
                $contextData = [
                    'access_level' => 'global',
                    'can_access_all_timelines' => true,
                    'can_access_all_users' => true,
                    'admin_instructions' => 'Du er en administrator. Du har adgang til alle brugere, familier og timeline-elementer. Vær særlig hjælpsom og detaljeret i dine svar.',
                ];
                break;

            case 'myndighed':
                // Authority can access their related families
                $contextData = [
                    'access_level' => 'family',
                    'can_access_all_timelines' => false,
                    'can_access_all_users' => false,
                    'authority_instructions' => 'Du er en myndighedsperson. Du har adgang til familier og brugere, som du er tilknyttet. Du kan se alle timeline-elementer for disse familier.',
                ];
                // Get families this authority has access to
                $familyIds = $this->getAuthorityFamilyIds($user);
                $contextData['accessible_family_ids'] = $familyIds;
                break;

            case 'far':
            case 'mor':
                // Parents have private access between themselves and authorities
                $contextData = [
                    'access_level' => 'private',
                    'can_access_all_timelines' => false,
                    'can_access_all_users' => false,
                    'parent_instructions' => 'Du er en forælder. Du har privat adgang til kommunikation mellem dig og myndighederne. Du kan kun se timeline-elementer, der vedrører din familie.',
                    'family_id' => $user->family_id,
                ];
                break;

            default:
                // Default approved user access
                $contextData = [
                    'access_level' => 'limited',
                    'can_access_all_timelines' => false,
                    'can_access_all_users' => false,
                ];
                break;
        }

        $executor->withContext($contextData);
    }

    /**
     * Get family IDs that an authority user has access to.
     */
    private function getAuthorityFamilyIds(User $user): array
    {
        // For now, return families where this authority has interacted
        // This could be extended based on actual authority-family relationships
        $familyIds = TimelineItem::where('user_id', $user->id)
            ->whereNotNull('family_id')
            ->distinct()
            ->pluck('family_id')
            ->toArray();

        // Also include the authority's own family if they have one
        if ($user->family_id) {
            $familyIds[] = $user->family_id;
        }

        return array_unique($familyIds);
    }

    /**
     * Get messages for a user based on their role.
     */
    private function getMessagesForUser(User $user, ?string $sessionId = null): array
    {
        // Use Vizra ADK to get messages
        // This is a simplified implementation - would need to be adapted based on Vizra ADK structure

        $role = $user->getRoleNames()->first();

        // For admin users, show more detailed information
        if ($user->hasRole('admin')) {
            Log::info('Admin user accessing chat messages', [
                'user_id' => $user->id,
                'session_id' => $sessionId,
                'role' => $role,
            ]);
        }

        // Placeholder - implement based on Vizra ADK message retrieval
        return [
            [
                'role' => 'assistant',
                'content' => $this->getWelcomeMessage($user),
                'timestamp' => now()->toISOString(),
            ]
        ];
    }

    /**
     * Get personalized welcome message based on user role.
     */
    private function getWelcomeMessage(User $user): string
    {
        $role = $user->getRoleNames()->first();
        $name = $user->name;

        switch ($role) {
            case 'admin':
                return "Hej {$name}! Som administrator har du fuld adgang til alle brugere og timeline-elementer. Hvordan kan jeg hjælpe dig i dag?";

            case 'myndighed':
                return "Hej {$name}! Som myndighedsperson har du adgang til familier og sager, som du er tilknyttet. Hvordan kan jeg hjælpe dig?";

            case 'far':
            case 'mor':
                return "Hej {$name}! Som forælder har du adgang til din families timeline og kommunikation med myndighederne. Hvordan kan jeg hjælpe dig?";

            default:
                return "Hej {$name}! Velkommen til Famlink chatten. Hvordan kan jeg hjælpe dig?";
        }
    }
}
