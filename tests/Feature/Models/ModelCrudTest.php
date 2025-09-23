<?php

use App\Models\Family;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Model CRUD Operations', function () {
    describe('User CRUD Operations', function () {
        it('can create users', function () {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
            ]);

            expect($user->exists)->toBeTrue();
            expect($user->name)->toBe('Test User');
            expect($user->email)->toBe('test@example.com');
        });

        it('can read users', function () {
            $user = User::factory()->create(['name' => 'John Doe']);

            $foundUser = User::find($user->id);
            expect($foundUser)->not->toBeNull();
            expect($foundUser->name)->toBe('John Doe');

            $foundByEmail = User::where('email', $user->email)->first();
            expect($foundByEmail->id)->toBe($user->id);
        });

        it('can update users', function () {
            $user = User::factory()->create(['name' => 'Original Name']);

            $user->update(['name' => 'Updated Name']);

            expect($user->name)->toBe('Updated Name');

            $refreshedUser = User::find($user->id);
            expect($refreshedUser->name)->toBe('Updated Name');
        });

        it('can delete users', function () {
            $user = User::factory()->create();
            $userId = $user->id;

            $user->delete();

            expect(User::find($userId))->toBeNull();
        });

        it('can query users with relationships', function () {
            $family = Family::factory()->create();
            $user1 = User::factory()->create(['family_id' => $family->id, 'name' => 'User 1']);
            $user2 = User::factory()->create(['family_id' => $family->id, 'name' => 'User 2']);
            $user3 = User::factory()->create(['name' => 'User 3']); // No family

            $familyUsers = User::where('family_id', $family->id)->get();
            expect($familyUsers)->toHaveCount(2);
            expect($familyUsers->pluck('name')->toArray())->toContain('User 1');
            expect($familyUsers->pluck('name')->toArray())->toContain('User 2');
            expect($familyUsers->pluck('name')->toArray())->not->toContain('User 3');
        });
    });

    describe('Family CRUD Operations', function () {
        it('can create families', function () {
            $family = Family::create([
                'name' => 'Test Family',
                'child_name' => 'Test Child',
            ]);

            expect($family->exists)->toBeTrue();
            expect($family->name)->toBe('Test Family');
            expect($family->child_name)->toBe('Test Child');
        });

        it('can read families', function () {
            $family = Family::factory()->create(['name' => 'Smith Family']);

            $foundFamily = Family::find($family->id);
            expect($foundFamily)->not->toBeNull();
            expect($foundFamily->name)->toBe('Smith Family');

            $foundByName = Family::where('name', 'Smith Family')->first();
            expect($foundByName->id)->toBe($family->id);
        });

        it('can update families', function () {
            $family = Family::factory()->create(['name' => 'Original Family']);

            $family->update(['name' => 'Updated Family']);

            expect($family->name)->toBe('Updated Family');

            $refreshedFamily = Family::find($family->id);
            expect($refreshedFamily->name)->toBe('Updated Family');
        });

        it('can delete families', function () {
            $family = Family::factory()->create();
            $familyId = $family->id;

            $family->delete();

            expect(Family::find($familyId))->toBeNull();
        });

        it('can query families with users', function () {
            $family1 = Family::factory()->create(['name' => 'Family 1']);
            $family2 = Family::factory()->create(['name' => 'Family 2']);

            User::factory()->count(2)->create(['family_id' => $family1->id]);
            User::factory()->count(1)->create(['family_id' => $family2->id]);

            $family1->refresh();
            $family2->refresh();

            expect($family1->users)->toHaveCount(2);
            expect($family2->users)->toHaveCount(1);
        });
    });

    describe('Event CRUD Operations', function () {
        it('can create timeline items', function () {
            $user = User::factory()->create();

            $timelineItem = Event::create([
                'user_id' => $user->id,
                'title' => 'Test Timeline Item',
                'content' => 'Test content',
                'date' => now()->toDateString(),
                'item_timestamp' => now(),
                'category' => 'parenting',
                'tags' => ['test', 'example'],
            ]);

            expect($timelineItem->exists)->toBeTrue();
            expect($timelineItem->title)->toBe('Test Timeline Item');
            expect($timelineItem->user_id)->toBe($user->id);
        });

        it('can read timeline items', function () {
            $timelineItem = Event::factory()->create(['title' => 'Unique Title']);

            $foundItem = Event::find($timelineItem->id);
            expect($foundItem)->not->toBeNull();
            expect($foundItem->title)->toBe('Unique Title');

            $foundByTitle = Event::where('title', 'Unique Title')->first();
            expect($foundByTitle->id)->toBe($timelineItem->id);
        });

        it('can update timeline items', function () {
            $timelineItem = Event::factory()->create(['title' => 'Original Title']);

            $timelineItem->update(['title' => 'Updated Title']);

            expect($timelineItem->title)->toBe('Updated Title');

            $refreshedItem = Event::find($timelineItem->id);
            expect($refreshedItem->title)->toBe('Updated Title');
        });

        it('can delete timeline items', function () {
            $timelineItem = Event::factory()->create();
            $itemId = $timelineItem->id;

            $timelineItem->delete();

            expect(Event::find($itemId))->toBeNull();
        });

        it('can query timeline items by user', function () {
            $user1 = User::factory()->create();
            $user2 = User::factory()->create();

            $item1 = Event::factory()->create(['user_id' => $user1->id, 'title' => 'Item 1']);
            $item2 = Event::factory()->create(['user_id' => $user1->id, 'title' => 'Item 2']);
            $item3 = Event::factory()->create(['user_id' => $user2->id, 'title' => 'Item 3']);

            $user1Items = Event::where('user_id', $user1->id)->get();
            expect($user1Items)->toHaveCount(2);
            expect($user1Items->pluck('title')->toArray())->toContain('Item 1');
            expect($user1Items->pluck('title')->toArray())->toContain('Item 2');
            expect($user1Items->pluck('title')->toArray())->not->toContain('Item 3');
        });
    });

    describe('Bulk Operations', function () {
        it('can perform bulk inserts', function () {
            $families = Family::factory()->count(5)->create();

            expect(Family::count())->toBeGreaterThanOrEqual(5);

            $familyNames = $families->pluck('name')->toArray();
            expect($familyNames)->toHaveCount(5);
        });

        it('can perform bulk updates', function () {
            $users = User::factory()->count(3)->create();
            $userIds = $users->pluck('id')->toArray();

            User::whereIn('id', $userIds)->update(['name' => 'Bulk Updated']);

            $updatedUsers = User::whereIn('id', $userIds)->get();
            foreach ($updatedUsers as $user) {
                expect($user->name)->toBe('Bulk Updated');
            }
        });

        it('can perform bulk deletes', function () {
            $timelineItems = Event::factory()->count(4)->create();
            $itemIds = $timelineItems->pluck('id')->toArray();

            Event::whereIn('id', $itemIds)->delete();

            $remainingItems = Event::whereIn('id', $itemIds)->get();
            expect($remainingItems)->toHaveCount(0);
        });
    });

    describe('Complex Queries', function () {
        it('can perform joins and aggregations', function () {
            $family = Family::factory()->create();
            $user1 = User::factory()->create(['family_id' => $family->id]);
            $user2 = User::factory()->create(['family_id' => $family->id]);

            Event::factory()->count(3)->create(['user_id' => $user1->id]);
            Event::factory()->count(2)->create(['user_id' => $user2->id]);

            $userWithCounts = User::withCount('timelineItems')
                ->where('family_id', $family->id)
                ->get();

            expect($userWithCounts)->toHaveCount(2);
            expect($userWithCounts->sum('timeline_items_count'))->toBe(5);
        });

        it('can perform eager loading', function () {
            $family = Family::factory()->create();
            $users = User::factory()->count(2)->create(['family_id' => $family->id]);

            foreach ($users as $user) {
                Event::factory()->count(2)->create(['user_id' => $user->id]);
            }

            $familyWithRelations = Family::with(['users.timelineItems'])->find($family->id);

            expect($familyWithRelations->users)->toHaveCount(2);
            foreach ($familyWithRelations->users as $user) {
                expect($user->timelineItems)->toHaveCount(2);
            }
        });

        it('can filter by JSON attributes', function () {
            // Since tags are now a relationship, we'll test tag filtering differently
            $urgentTag = \App\Models\Tag::firstOrCreate(['name' => 'urgent']);
            $medicalTag = \App\Models\Tag::firstOrCreate(['name' => 'medical']);
            $routineTag = \App\Models\Tag::firstOrCreate(['name' => 'routine']);

            $item1 = Event::factory()->create();
            $item1->tags()->detach(); // Clear any auto-attached tags
            $item1->tags()->attach([$urgentTag->id, $medicalTag->id]);

            $item2 = Event::factory()->create();
            $item2->tags()->detach(); // Clear any auto-attached tags
            $item2->tags()->attach([$routineTag->id]);

            $item3 = Event::factory()->create();
            $item3->tags()->detach(); // Clear any auto-attached tags
            $item3->tags()->attach([$urgentTag->id]);

            // Test filtering by tags using relationships
            $urgentItems = Event::whereHas('tags', function ($query) {
                $query->where('name', 'urgent');
            })->get();

            expect($urgentItems->pluck('id')->toArray())->toContain($item1->id);
            expect($urgentItems->pluck('id')->toArray())->toContain($item3->id);
            expect($urgentItems->pluck('id')->toArray())->not->toContain($item2->id);
        });
    });

    describe('Model Relationships', function () {
        it('maintains referential integrity', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create(['user_id' => $user->id]);

            // Test that relationships work both ways
            expect($user->family->id)->toBe($family->id);
            expect($timelineItem->user->id)->toBe($user->id);
            expect($family->users->first()->id)->toBe($user->id);
            expect($user->timelineItems->first()->id)->toBe($timelineItem->id);
        });

        it('handles null relationships gracefully', function () {
            $user = User::factory()->create(['family_id' => null]);

            expect($user->family)->toBeNull();
            expect($user->family_id)->toBeNull();
        });
    });
});
