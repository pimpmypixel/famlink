<?php

use App\Models\Event;
use App\Models\Family;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Model Factory Tests', function () {
    describe('User Factory', function () {
        it('creates users with valid attributes', function () {
            $user = User::factory()->make();

            expect($user->name)->toBeString();
            expect($user->email)->toBeString();
            expect(filter_var($user->email, FILTER_VALIDATE_EMAIL))->toBeTruthy();
            expect($user->password)->toBeString();
        });

        it('can create and save users to database', function () {
            $user = User::factory()->create();

            expect($user->exists)->toBeTrue();
            expect($user->id)->toBeString(); // Now using UUIDs
            expect($user->created_at)->not->toBeNull();
            expect($user->updated_at)->not->toBeNull();
        });

        it('creates users with family relationships', function () {
            $user = User::factory()->withFamily()->create();

            expect($user->family_id)->not->toBeNull();
            expect($user->family)->not->toBeNull();
            expect($user->family->id)->toBe($user->family_id);
        });

        it('creates multiple unique users', function () {
            $users = User::factory()->count(5)->create();

            expect($users)->toHaveCount(5);

            $emails = $users->pluck('email')->toArray();
            expect($emails)->toBe(array_unique($emails)); // All emails should be unique

            $ids = $users->pluck('id')->toArray();
            expect($ids)->toBe(array_unique($ids)); // All IDs should be unique
        });
    });

    describe('Family Factory', function () {
        it('creates families with valid attributes', function () {
            $family = Family::factory()->make();

            expect($family->name)->toBeString();
            expect($family->child_name)->toBeString();
            expect($family->name)->toContain('Family');
        });

        it('can create and save families to database', function () {
            $family = Family::factory()->create();

            expect($family->exists)->toBeTrue();
            expect($family->id)->toBeString(); // Now using UUIDs
            expect($family->created_at)->not->toBeNull();
            expect($family->updated_at)->not->toBeNull();
        });

        it('creates multiple unique families', function () {
            $families = Family::factory()->count(3)->create();

            expect($families)->toHaveCount(3);

            $names = $families->pluck('name')->toArray();
            expect($names)->toBe(array_unique($names)); // All names should be unique

            $ids = $families->pluck('id')->toArray();
            expect($ids)->toBe(array_unique($ids)); // All IDs should be unique
        });
    });

    describe('Event Factory', function () {
        it('creates timeline items with valid attributes', function () {
            $timelineItem = Event::factory()->make();

            expect($timelineItem->title)->toBeString();
            expect($timelineItem->content)->toBeString();
            expect($timelineItem->category_id)->not->toBeNull();
            expect($timelineItem->tags)->toBeCollection();
        });

        it('can create and save timeline items to database', function () {
            $timelineItem = Event::factory()->create();

            expect($timelineItem->exists)->toBeTrue();
            expect($timelineItem->id)->toBeString(); // Now using UUIDs
            expect($timelineItem->user_id)->not->toBeNull();
            expect($timelineItem->created_at)->not->toBeNull();
            expect($timelineItem->updated_at)->not->toBeNull();
        });

        it('creates timeline items with user relationships', function () {
            $timelineItem = Event::factory()->create();

            expect($timelineItem->user_id)->not->toBeNull();
            expect($timelineItem->user)->not->toBeNull();
            expect($timelineItem->user->id)->toBe($timelineItem->user_id);
        });

        it('can create timeline items with specific categories', function () {
            $consultationItem = Event::factory()->category('consultation')->create();
            $parentingItem = Event::factory()->category('parenting')->create();

            expect($consultationItem->category->name)->toBe('consultation');
            expect($parentingItem->category->name)->toBe('parenting');
        });

        it('creates multiple timeline items for same user', function () {
            $user = User::factory()->create();
            $timelineItems = Event::factory()->count(3)->create(['user_id' => $user->id]);

            expect($timelineItems)->toHaveCount(3);

            foreach ($timelineItems as $item) {
                expect($item->user_id)->toBe($user->id);
            }
        });
    });

    describe('Factory Relationships', function () {
        it('creates complex family structures', function () {
            $family = Family::factory()->create();
            $users = User::factory()->count(2)->create(['family_id' => $family->id]);

            foreach ($users as $user) {
                Event::factory()->count(2)->create(['user_id' => $user->id]);
            }

            $family->refresh();
            expect($family->users)->toHaveCount(2);

            foreach ($family->users as $user) {
                expect($user->timelineItems)->toHaveCount(2);
            }
        });

        it('maintains referential integrity', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = Event::factory()->create(['user_id' => $user->id]);

            // Test forward relationships
            expect($user->family->id)->toBe($family->id);
            expect($timelineItem->user->id)->toBe($user->id);

            // Test reverse relationships
            expect($family->users->first()->id)->toBe($user->id);
            expect($user->timelineItems->first()->id)->toBe($timelineItem->id);
        });

        it('handles bulk creation efficiently', function () {
            $startTime = microtime(true);

            $families = Family::factory()->count(10)->create();
            foreach ($families as $family) {
                User::factory()->count(2)->create(['family_id' => $family->id]);
            }

            $endTime = microtime(true);
            $executionTime = $endTime - $startTime;

            expect($executionTime)->toBeLessThan(5.0); // Should complete within 5 seconds
            expect(Family::count())->toBeGreaterThanOrEqual(10); // At least 10 families created
            expect(User::count())->toBeGreaterThanOrEqual(20); // At least 20 users created
        });
    });

    describe('Factory Data Integrity', function () {
        it('creates valid email addresses', function () {
            $users = User::factory()->count(10)->create();

            foreach ($users as $user) {
                expect(filter_var($user->email, FILTER_VALIDATE_EMAIL))->toBeTruthy();
            }
        });

        it('creates valid dates', function () {
            $timelineItems = Event::factory()->count(5)->create();

            foreach ($timelineItems as $item) {
                expect($item->date)->toBeInstanceOf(\Carbon\Carbon::class);
                expect($item->item_timestamp)->toBeInstanceOf(\Carbon\Carbon::class);
                expect($item->created_at)->toBeInstanceOf(\Carbon\Carbon::class);
                expect($item->updated_at)->toBeInstanceOf(\Carbon\Carbon::class);
            }
        });

        it('creates valid JSON arrays', function () {
            $timelineItem = Event::factory()->create();

            expect($timelineItem->tags)->toBeInstanceOf(\Illuminate\Database\Eloquent\Collection::class);
            expect($timelineItem->tags->count())->toBeGreaterThan(0);
            expect($timelineItem->tags->first())->toBeInstanceOf(\App\Models\Tag::class);
        });
    });
});
