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

        // User Permissions
        $userPermissions = [
            // Timeline permissions
            'view-timeline',
            'create-timeline-item',
            'edit-own-timeline-item',
            'edit-any-timeline-item',
            'delete-own-timeline-item',
            'delete-any-timeline-item',
            'view-private-timeline-items',

            // Comment permissions
            'create-comment',
            'edit-own-comment',
            'edit-any-comment',
            'delete-own-comment',
            'delete-any-comment',
            'view-private-comments',

            // Category and Tag permissions
            'manage-categories',
            'manage-tags',

            // File permissions
            'upload-files',
            'download-files',
            'delete-own-files',
            'delete-any-files',
            'view-file-attachments',

            // User management permissions
            'view-users',
            'manage-users',
            'impersonate-users',

            // Family permissions
            'view-family-members',
            'manage-family-members',
            'view-family-timeline',
            'manage-family-settings',

            // Profile permissions
            'view-own-profile',
            'edit-own-profile',
            'view-any-profile',
            'edit-any-profile',

            // Notification permissions
            'receive-notifications',
            'send-notifications',
            'manage-notifications',

            // Search permissions
            'search-timeline',
            'search-files',
            'advanced-search',

            // Export permissions
            'export-timeline',
            'export-reports',
            'export-family-data',

            // Admin permissions
            'view-analytics',
            'manage-system-settings',
            'view-audit-logs',
            'manage-backups',
        ];

        // Create all permissions
        foreach ($userPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign permissions to roles
        $this->assignPermissionsToRoles();
    }

    /**
     * Assign permissions to existing roles
     */
    private function assignPermissionsToRoles(): void
    {
        // Admin role - all permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->givePermissionTo(Permission::all());
        }

        // Social worker (myndighed) permissions
        $socialWorkerRole = Role::where('name', 'myndighed')->first();
        if ($socialWorkerRole) {
            $socialWorkerPermissions = [
                'view-timeline',
                'create-timeline-item',
                'edit-own-timeline-item',
                'create-comment',
                'edit-own-comment',
                'delete-own-comment',
                'upload-files',
                'download-files',
                'view-family-members',
                'view-family-timeline',
                'view-own-profile',
                'edit-own-profile',
                'receive-notifications',
                'send-notifications',
                'search-timeline',
                'export-timeline',
                'export-reports',
                'view-analytics',
                'view-audit-logs',
            ];
            $socialWorkerRole->givePermissionTo($socialWorkerPermissions);
        }

        // Parent (far/mor) permissions
        $parentRoles = Role::whereIn('name', ['far', 'mor'])->get();
        foreach ($parentRoles as $parentRole) {
            $parentPermissions = [
                'view-timeline',
                'create-timeline-item',
                'edit-own-timeline-item',
                'delete-own-timeline-item',
                'create-comment',
                'edit-own-comment',
                'delete-own-comment',
                'upload-files',
                'download-files',
                'delete-own-files',
                'view-family-members',
                'view-family-timeline',
                'manage-family-members',
                'view-own-profile',
                'edit-own-profile',
                'receive-notifications',
                'search-timeline',
                'search-files',
                'export-timeline',
                'export-family-data',
            ];
            $parentRole->givePermissionTo($parentPermissions);
        }

        // Consultant (andet) permissions
        $consultantRole = Role::where('name', 'andet')->first();
        if ($consultantRole) {
            $consultantPermissions = [
                'view-timeline',
                'create-timeline-item',
                'edit-own-timeline-item',
                'create-comment',
                'edit-own-comment',
                'upload-files',
                'download-files',
                'view-family-members',
                'view-family-timeline',
                'view-own-profile',
                'edit-own-profile',
                'receive-notifications',
                'search-timeline',
                'export-timeline',
            ];
            $consultantRole->givePermissionTo($consultantPermissions);
        }

        // Temporary user permissions (limited access)
        $temporaryRole = Role::where('name', 'temporary')->first();
        if ($temporaryRole) {
            $temporaryPermissions = [
                'view-timeline',
                'view-own-profile',
                'receive-notifications',
            ];
            $temporaryRole->givePermissionTo($temporaryPermissions);
        }

        // Approved user permissions (standard access)
        $approvedRole = Role::where('name', 'approved')->first();
        if ($approvedRole) {
            $approvedPermissions = [
                'view-timeline',
                'create-timeline-item',
                'edit-own-timeline-item',
                'create-comment',
                'edit-own-comment',
                'upload-files',
                'download-files',
                'view-family-members',
                'view-family-timeline',
                'view-own-profile',
                'edit-own-profile',
                'receive-notifications',
                'search-timeline',
            ];
            $approvedRole->givePermissionTo($approvedPermissions);
        }
    }
}
