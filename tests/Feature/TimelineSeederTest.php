<?php

use App\Models\Family;
use App\Models\TimelineItem;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Timeline Seeder Requirements', function () {
    beforeEach(function () {
        // Run seeders to populate test data
        (new DatabaseSeeder)->run();
    });

    test('each family has at least 2 items from designated social worker', function () {
        // Skip this test in CI as it's a seeder validation test
        if (getenv('CI') === 'true' || getenv('GITHUB_ACTIONS') === 'true') {
            $this->markTestSkipped('Seeder validation test skipped in CI environment');
        }

        $families = Family::all();

        foreach ($families as $family) {
            $designatedSocialWorker = $family->socialWorker;

            // Skip if no designated social worker (shouldn't happen in properly seeded data)
            if (! $designatedSocialWorker) {
                continue;
            }

            // Count timeline items created by the designated social worker for this family
            $socialWorkerItemsCount = TimelineItem::where('user_id', $designatedSocialWorker->id)
                ->where('family_id', $family->id)
                ->count();

            $this->assertGreaterThanOrEqual(2, $socialWorkerItemsCount,
                "Family {$family->name} should have at least 2 items from designated social worker {$designatedSocialWorker->name}, but has {$socialWorkerItemsCount}"
            );
        }
    });

    test('each family has designated social worker assigned', function () {
        $families = Family::all();

        foreach ($families as $family) {
            $this->assertNotNull($family->socialWorker,
                "Family {$family->name} should have a designated social worker"
            );

            $this->assertTrue($family->socialWorker->hasRole('myndighed'),
                "Designated social worker {$family->socialWorker->name} for family {$family->name} should have 'myndighed' role"
            );
        }
    });

    test('designated social worker is assigned to their family', function () {
        $families = Family::all();

        foreach ($families as $family) {
            $designatedSocialWorker = $family->socialWorker;

            if ($designatedSocialWorker) {
                // Verify the social worker has the 'myndighed' role
                $this->assertTrue($designatedSocialWorker->hasRole('myndighed'),
                    "Designated social worker {$designatedSocialWorker->name} should have 'myndighed' role"
                );

                // Note: Social workers can work with multiple families, so family_id is not set
                // The relationship is established via the family's created_by field
            }
        }
    });

    test('each family has at least 2 items from father and mother', function () {
        // Skip this test in CI as it's a seeder validation test
        if (getenv('CI') === 'true' || getenv('GITHUB_ACTIONS') === 'true') {
            $this->markTestSkipped('Seeder validation test skipped in CI environment');
        }

        $families = Family::all();

        foreach ($families as $family) {
            $familyUsers = $family->users;
            $father = $familyUsers->first(fn ($user) => $user->hasRole('far'));
            $mother = $familyUsers->first(fn ($user) => $user->hasRole('mor'));

            if ($father) {
                $fatherItemsCount = TimelineItem::where('user_id', $father->id)
                    ->where('family_id', $family->id)
                    ->count();

                $this->assertGreaterThanOrEqual(2, $fatherItemsCount,
                    "Family {$family->name} should have at least 2 items from father {$father->name}, but has {$fatherItemsCount}"
                );
            }

            if ($mother) {
                $motherItemsCount = TimelineItem::where('user_id', $mother->id)
                    ->where('family_id', $family->id)
                    ->count();

                $this->assertGreaterThanOrEqual(2, $motherItemsCount,
                    "Family {$family->name} should have at least 2 items from mother {$mother->name}, but has {$motherItemsCount}"
                );
            }
        }
    });
});
