<?php

use App\Models\Family;
use App\Models\TimelineItem;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Timeline API', function () {
    beforeEach(function () {
        (new DatabaseSeeder)->run();
    });

    test('timeline endpoint returns items with user roles', function () {
        $user = User::whereHas('roles', function ($query) {
            $query->where('name', 'far');
        })->first();

        $this->actingAs($user);

        $response = $this->get('/timeline');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('authenticated/timeline_page')
                ->has('timelineItems')
                ->where('timelineItems', function ($timelineItems) {
                    $items = $timelineItems->toArray();
                    expect($items)->toBeArray();
                    expect(count($items))->toBeGreaterThan(0);

                    // Check that at least one item has a user with role information
                    $hasRoleInfo = false;
                    foreach ($items as $item) {
                        if (isset($item['user']['role'])) {
                            $hasRoleInfo = true;
                            break;
                        }
                    }

                    expect($hasRoleInfo)->toBeTrue('Timeline items should include user role information');

                    return true;
                })
            );
    });

    test('social worker items appear in timeline for admin users', function () {
        $admin = User::whereHas('roles', function ($query) {
            $query->where('name', 'admin');
        })->first();

        $this->actingAs($admin);

        $response = $this->get('/timeline');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('authenticated/timeline_page')
                ->has('timelineItems')
                ->where('timelineItems', function ($timelineItems) {
                    $items = $timelineItems->toArray();
                    // Check if any items have social worker role
                    $socialWorkerItems = array_filter($items, function ($item) {
                        return isset($item['user']['role']) && $item['user']['role'] === 'myndighed';
                    });

                    expect(count($socialWorkerItems))->toBeGreaterThan(0, 'Should have social worker timeline items for admin');

                    return true;
                })
            );
    });

    test('timeline items include role and roles arrays', function () {
        $user = User::whereHas('roles', function ($query) {
            $query->where('name', 'far');
        })->first();

        $this->actingAs($user);

        $response = $this->get('/timeline');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('authenticated/timeline_page')
                ->has('timelineItems')
                ->where('timelineItems', function ($timelineItems) {
                    $items = $timelineItems->toArray();
                    foreach ($items as $item) {
                        expect($item)->toHaveKey('user');
                        expect($item['user'])->toHaveKey('role');
                        expect($item['user'])->toHaveKey('roles');
                        expect($item['user']['roles'])->toBeArray();
                    }

                    return true;
                })
            );
    });

    test('each family has at least 2 timeline items from social workers', function () {
        $families = Family::all();

        foreach ($families as $family) {
            // Count social worker items for this family (items created by users with 'myndighed' role)
            $socialWorkerItemsCount = TimelineItem::where('family_id', $family->id)
                ->whereHas('user', function ($query) {
                    $query->role('myndighed');
                })
                ->count();

            expect($socialWorkerItemsCount)->toBeGreaterThanOrEqual(2,
                "Family {$family->name} should have at least 2 timeline items from social workers, but has {$socialWorkerItemsCount}"
            );
        }
    });

    test('all timeline items have at least 1 comment', function () {
        $timelineItems = TimelineItem::all();

        foreach ($timelineItems as $item) {
            $commentCount = $item->comments()->count();

            expect($commentCount)->toBeGreaterThanOrEqual(1,
                "Timeline item '{$item->title}' (ID: {$item->id}) should have at least 1 comment, but has {$commentCount}"
            );
        }
    });
});
