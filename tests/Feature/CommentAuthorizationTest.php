<?php

use App\Models\Comment;
use App\Models\Family;
use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role as SpatieRole;

uses(RefreshDatabase::class);

describe('Comment Authorization', function () {
    beforeEach(function () {
        // Ensure roles exist for testing
        SpatieRole::firstOrCreate(['name' => 'myndighed']);
        SpatieRole::firstOrCreate(['name' => 'far']);
        SpatieRole::firstOrCreate(['name' => 'mor']);
        SpatieRole::firstOrCreate(['name' => 'admin']);
        SpatieRole::firstOrCreate(['name' => 'andet']);
    });

    describe('Comment Creation Authorization', function () {
        it('allows family members to comment on their family timeline items', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = TimelineItem::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $response = actingAs($user)
                ->post("/timeline/{$timelineItem->id}/comments", [
                    'content' => 'This is a test comment',
                ]);

            $response->assertRedirect()
                ->assertSessionHas('success', 'Comment added successfully!');

            expect(Comment::where('timeline_item_id', $timelineItem->id)->count())->toBe(1);
            expect(Comment::first()->content)->toBe('This is a test comment');
            expect(Comment::first()->user_id)->toBe($user->id);
        });

        it('allows social workers to comment on any timeline item', function () {
            $family = Family::factory()->create();
            $socialWorker = User::factory()->create();
            $socialWorker->assignRole('myndighed');

            $timelineItem = TimelineItem::factory()->create([
                'family_id' => $family->id,
            ]);

            $response = actingAs($socialWorker)
                ->post("/timeline/{$timelineItem->id}/comments", [
                    'content' => 'Social worker comment',
                ]);

            $response->assertRedirect()
                ->assertSessionHas('success', 'Comment added successfully!');

            expect(Comment::where('timeline_item_id', $timelineItem->id)->count())->toBe(1);
            expect(Comment::first()->content)->toBe('Social worker comment');
            expect(Comment::first()->user_id)->toBe($socialWorker->id);
        });

        it('denies users from commenting on timeline items from other families', function () {
            $family1 = Family::factory()->create();
            $family2 = Family::factory()->create();

            $userFromFamily1 = User::factory()->create(['family_id' => $family1->id]);
            $timelineItemFromFamily2 = TimelineItem::factory()->create([
                'family_id' => $family2->id,
            ]);

            $response = actingAs($userFromFamily1)
                ->post("/timeline/{$timelineItemFromFamily2->id}/comments", [
                    'content' => 'This should not be allowed',
                ]);

            $response->assertForbidden();

            expect(Comment::where('timeline_item_id', $timelineItemFromFamily2->id)->count())->toBe(0);
        });

        it('denies users without family from commenting', function () {
            $userWithoutFamily = User::factory()->create(['family_id' => null]);
            $family = Family::factory()->create();
            $timelineItem = TimelineItem::factory()->create([
                'family_id' => $family->id,
            ]);

            $response = actingAs($userWithoutFamily)
                ->post("/timeline/{$timelineItem->id}/comments", [
                    'content' => 'This should not be allowed',
                ]);

            $response->assertForbidden();

            expect(Comment::where('timeline_item_id', $timelineItem->id)->count())->toBe(0);
        });

        it('denies unauthenticated users from commenting', function () {
            $family = Family::factory()->create();
            $timelineItem = TimelineItem::factory()->create([
                'family_id' => $family->id,
            ]);

            $response = $this->post("/timeline/{$timelineItem->id}/comments", [
                'content' => 'This should not be allowed',
            ]);

            $response->assertRedirect('/login');

            expect(Comment::where('timeline_item_id', $timelineItem->id)->count())->toBe(0);
        });
    });

    describe('Comment Validation', function () {
        it('validates comment content is required', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = TimelineItem::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $response = actingAs($user)
                ->post("/timeline/{$timelineItem->id}/comments", [
                    'content' => '',
                ]);

            $response->assertRedirect()
                ->assertSessionHasErrors(['content' => 'The content field is required.']);

            expect(Comment::where('timeline_item_id', $timelineItem->id)->count())->toBe(0);
        });

        it('validates comment content is not too long', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = TimelineItem::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $longContent = str_repeat('a', 1001); // 1001 characters

            $response = actingAs($user)
                ->post("/timeline/{$timelineItem->id}/comments", [
                    'content' => $longContent,
                ]);

            $response->assertRedirect()
                ->assertSessionHasErrors(['content' => 'The content field must not be greater than 1000 characters.']);

            expect(Comment::where('timeline_item_id', $timelineItem->id)->count())->toBe(0);
        });

        it('accepts valid comment content', function () {
            $family = Family::factory()->create();
            $user = User::factory()->create(['family_id' => $family->id]);
            $timelineItem = TimelineItem::factory()->create([
                'user_id' => $user->id,
                'family_id' => $family->id,
            ]);

            $validContent = str_repeat('a', 1000); // Exactly 1000 characters

            $response = actingAs($user)
                ->post("/timeline/{$timelineItem->id}/comments", [
                    'content' => $validContent,
                ]);

            $response->assertRedirect()
                ->assertSessionHas('success', 'Comment added successfully!');

            expect(Comment::where('timeline_item_id', $timelineItem->id)->count())->toBe(1);
        });
    });
});
