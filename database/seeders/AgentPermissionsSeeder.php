<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing permissions and roles
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        $this->createAgentPermissions()
            ->createAgentRoles()
            ->assignPermissionsToRoles();
    }

    private function createAgentPermissions(): self
    {
        $agentPermissions = [
            // Vector memory permissions
            'access-vector-memory',
            'create-vector-embeddings',
            'search-vector-memory',
            'manage-vector-memory',

            // File analysis permissions
            'analyze-uploaded-files',
            'extract-file-content',
            'process-file-metadata',
            'generate-file-insights',

            // Timeline analysis permissions
            'analyze-timeline-patterns',
            'generate-timeline-insights',
            'predict-timeline-events',
            'summarize-timeline-data',

            // User context permissions
            'access-user-context',
            'analyze-user-behavior',
            'generate-user-insights',
            'personalize-responses',

            // Tool execution permissions
            'execute-timeline-tools',
            'execute-user-tools',
            'execute-file-tools',
            'execute-search-tools',

            // Session management permissions
            'manage-agent-sessions',
            'persist-session-data',
            'access-session-history',

            // Integration permissions
            'integrate-external-services',
            'process-external-data',
            'generate-api-responses',

            // Learning permissions
            'learn-from-interactions',
            'update-knowledge-base',
            'improve-response-quality',
        ];

        // Create all agent permissions
        foreach ($agentPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        return $this;
    }

    /**
     * Create agent roles and assign permissions
     */
    private function createAgentRoles(): self
    {
        // File Analysis Agent role
        $fileAnalysisRole = Role::firstOrCreate(['name' => 'file-analysis-agent']);
        $fileAnalysisPermissions = [
            'access-vector-memory',
            'create-vector-embeddings',
            'search-vector-memory',
            'analyze-uploaded-files',
            'extract-file-content',
            'process-file-metadata',
            'generate-file-insights',
            'execute-file-tools',
            'manage-agent-sessions',
            'persist-session-data',
            'learn-from-interactions',
            'update-knowledge-base',
        ];
        $fileAnalysisRole->givePermissionTo($fileAnalysisPermissions);

        // Onboarding Agent role
        $onboardingRole = Role::firstOrCreate(['name' => 'onboarding-agent']);
        $onboardingPermissions = [
            'access-user-context',
            'analyze-user-behavior',
            'generate-user-insights',
            'personalize-responses',
            'manage-agent-sessions',
            'persist-session-data',
            'access-session-history',
            'learn-from-interactions',
            'update-knowledge-base',
            'improve-response-quality',
        ];
        $onboardingRole->givePermissionTo($onboardingPermissions);

        // Customer Support Agent role
        $supportRole = Role::firstOrCreate(['name' => 'customer-support-agent']);
        $supportPermissions = [
            'access-user-context',
            'analyze-timeline-patterns',
            'generate-timeline-insights',
            'execute-timeline-tools',
            'execute-user-tools',
            'manage-agent-sessions',
            'persist-session-data',
            'access-session-history',
            'integrate-external-services',
            'generate-api-responses',
            'learn-from-interactions',
            'improve-response-quality',
        ];
        $supportRole->givePermissionTo($supportPermissions);

        // Onboarding Summary Agent role
        $summaryRole = Role::firstOrCreate(['name' => 'onboarding-summary-agent']);
        $summaryPermissions = [
            'access-user-context',
            'analyze-user-behavior',
            'analyze-timeline-patterns',
            'generate-user-insights',
            'generate-timeline-insights',
            'summarize-timeline-data',
            'manage-agent-sessions',
            'persist-session-data',
            'access-session-history',
            'learn-from-interactions',
            'update-knowledge-base',
        ];
        $summaryRole->givePermissionTo($summaryPermissions);

        // General AI Agent role (base permissions for all agents)
        $generalAgentRole = Role::firstOrCreate(['name' => 'ai-agent']);
        $generalAgentPermissions = [
            'access-vector-memory',
            'search-vector-memory',
            'manage-agent-sessions',
            'persist-session-data',
            'learn-from-interactions',
            'generate-api-responses',
        ];
        $generalAgentRole->givePermissionTo($generalAgentPermissions);

        return $this;
    }

    /**
     * Assign permissions to existing roles
     */
    private function assignPermissionsToRoles(): self
    {
        // Admin role - all permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo(Permission::all());
        }

        return $this;
    }
}
