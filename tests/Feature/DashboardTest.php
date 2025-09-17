<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('admin users receive dashboard statistics', function () {
    // Ensure admin role exists
    Role::firstOrCreate(['name' => 'admin']);

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('stats')
            ->where('stats.users_count', 1) // At least the admin user
            ->where('stats.families_count', 0) // No families in test
            ->where('stats.timeline_items_count', 0) // No timeline items in test
            ->where('stats.comments_count', 0) // No comments in test
        );
});

test('social worker users receive their specific dashboard statistics and timeline cases', function () {
    // Ensure roles exist
    Role::firstOrCreate(['name' => 'myndighed']);
    Role::firstOrCreate(['name' => 'far']);
    Role::firstOrCreate(['name' => 'mor']);

    // Create social worker
    $socialWorker = User::factory()->create();
    $socialWorker->assignRole('myndighed');

    // Create families assigned to this social worker
    $family1 = \App\Models\Family::factory()->create(['created_by' => $socialWorker->id]);
    $family2 = \App\Models\Family::factory()->create(['created_by' => $socialWorker->id]);

    // Create users for these families
    $father1 = User::factory()->create(['family_id' => $family1->id]);
    $father1->assignRole('far');
    $mother1 = User::factory()->create(['family_id' => $family1->id]);
    $mother1->assignRole('mor');

    $father2 = User::factory()->create(['family_id' => $family2->id]);
    $father2->assignRole('far');

    // Create timeline items for these families
    \App\Models\TimelineItem::factory()->create([
        'user_id' => $father1->id,
        'family_id' => $family1->id,
        'title' => 'Test Timeline Item 1',
        'content' => 'Test content 1',
    ]);

    \App\Models\TimelineItem::factory()->create([
        'user_id' => $mother1->id,
        'family_id' => $family1->id,
        'title' => 'Test Timeline Item 2',
        'content' => 'Test content 2',
    ]);

    $this->actingAs($socialWorker);

    $response = $this->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('stats')
            ->has('timelineCases')
            ->where('stats.families_count', 2) // 2 families assigned to this social worker
            ->where('stats.users_count', 3) // 3 users in those families
            ->where('stats.timeline_items_count', 2) // 2 timeline items
            ->where('userRole', 'myndighed')
        );
});
