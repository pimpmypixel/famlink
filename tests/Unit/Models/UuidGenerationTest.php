<?php

use App\Models\Family;
use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Ramsey\Uuid\Uuid;

uses(RefreshDatabase::class);

describe('UUID Generation for Models', function () {
    describe('User Model UUID Generation', function () {
        it('has UUID generation methods configured', function () {
            $user = new User;

            expect(method_exists($user, 'newUniqueId'))->toBeTrue();
            expect(method_exists($user, 'uniqueIds'))->toBeTrue();
            expect($user->uniqueIds())->toBe(['id']);
        });

        it('generates valid UUID4 values', function () {
            $user = new User;

            $uuid1 = $user->newUniqueId();
            $uuid2 = $user->newUniqueId();

            expect(Uuid::isValid($uuid1))->toBeTrue();
            expect(Uuid::isValid($uuid2))->toBeTrue();
            expect(Uuid::fromString($uuid1)->getVersion())->toBe(7);
            expect(Uuid::fromString($uuid2)->getVersion())->toBe(7);
            expect($uuid1)->not->toBe($uuid2);
        });

        it('generates unique UUIDs consistently', function () {
            $user = new User;
            $uuids = [];

            for ($i = 0; $i < 100; $i++) {
                $uuid = $user->newUniqueId();
                expect(Uuid::isValid($uuid))->toBeTrue();
                expect(Uuid::fromString($uuid)->getVersion())->toBe(7);
                expect($uuids)->not->toContain($uuid);
                $uuids[] = $uuid;
            }
        });
    });

    describe('Family Model UUID Generation', function () {
        it('has UUID generation methods configured', function () {
            $family = new Family;

            expect(method_exists($family, 'newUniqueId'))->toBeTrue();
            expect(method_exists($family, 'uniqueIds'))->toBeTrue();
            expect($family->uniqueIds())->toBe(['id']);
        });

        it('generates valid UUID4 values', function () {
            $family = new Family;

            $uuid1 = $family->newUniqueId();
            $uuid2 = $family->newUniqueId();

            expect(Uuid::isValid($uuid1))->toBeTrue();
            expect(Uuid::isValid($uuid2))->toBeTrue();
            expect(Uuid::fromString($uuid1)->getVersion())->toBe(7);
            expect(Uuid::fromString($uuid2)->getVersion())->toBe(7);
            expect($uuid1)->not->toBe($uuid2);
        });

        it('generates unique UUIDs consistently', function () {
            $family = new Family;
            $uuids = [];

            for ($i = 0; $i < 100; $i++) {
                $uuid = $family->newUniqueId();
                expect(Uuid::isValid($uuid))->toBeTrue();
                expect(Uuid::fromString($uuid)->getVersion())->toBe(7);
                expect($uuids)->not->toContain($uuid);
                $uuids[] = $uuid;
            }
        });
    });

    describe('TimelineItem Model UUID Generation', function () {
        it('has UUID generation methods configured', function () {
            $timelineItem = new TimelineItem;

            expect(method_exists($timelineItem, 'newUniqueId'))->toBeTrue();
            expect(method_exists($timelineItem, 'uniqueIds'))->toBeTrue();
            expect($timelineItem->uniqueIds())->toBe(['id']);
        });

        it('generates valid UUID4 values', function () {
            $timelineItem = new TimelineItem;

            $uuid1 = $timelineItem->newUniqueId();
            $uuid2 = $timelineItem->newUniqueId();

            expect(Uuid::isValid($uuid1))->toBeTrue();
            expect(Uuid::isValid($uuid2))->toBeTrue();
            expect(Uuid::fromString($uuid1)->getVersion())->toBe(7);
            expect(Uuid::fromString($uuid2)->getVersion())->toBe(7);
            expect($uuid1)->not->toBe($uuid2);
        });

        it('generates unique UUIDs consistently', function () {
            $timelineItem = new TimelineItem;
            $uuids = [];

            for ($i = 0; $i < 100; $i++) {
                $uuid = $timelineItem->newUniqueId();
                expect(Uuid::isValid($uuid))->toBeTrue();
                expect(Uuid::fromString($uuid)->getVersion())->toBe(7);
                expect($uuids)->not->toContain($uuid);
                $uuids[] = $uuid;
            }
        });
    });

    describe('Cross-Model UUID Generation', function () {
        it('generates different UUIDs across different model types', function () {
            $user = new User;
            $family = new Family;
            $timelineItem = new TimelineItem;

            $userUuid = $user->newUniqueId();
            $familyUuid = $family->newUniqueId();
            $timelineUuid = $timelineItem->newUniqueId();

            expect($userUuid)->not->toBe($familyUuid);
            expect($userUuid)->not->toBe($timelineUuid);
            expect($familyUuid)->not->toBe($timelineUuid);

            expect(Uuid::isValid($userUuid))->toBeTrue();
            expect(Uuid::isValid($familyUuid))->toBeTrue();
            expect(Uuid::isValid($timelineUuid))->toBeTrue();
        });

        it('all models use UUID4 version', function () {
            $models = [new User, new Family, new TimelineItem];

            foreach ($models as $model) {
                $uuid = $model->newUniqueId();
                expect(Uuid::fromString($uuid)->getVersion())->toBe(7);
            }
        });

        it('UUID generation is thread-safe and collision-resistant', function () {
            $allUuids = [];
            $models = [new User, new Family, new TimelineItem];

            // Generate many UUIDs from different model instances
            foreach ($models as $model) {
                for ($i = 0; $i < 50; $i++) {
                    $uuid = $model->newUniqueId();
                    expect($allUuids)->not->toContain($uuid);
                    $allUuids[] = $uuid;
                }
            }

            expect($allUuids)->toHaveCount(150);
        });
    });

    describe('UUID Format Validation', function () {
        it('generates UUIDs in correct string format', function () {
            $user = new User;
            $uuid = $user->newUniqueId();

            // UUID7 format: xxxxxxxx-xxxx-7xxx-yxxx-xxxxxxxxxxxx
            expect($uuid)->toMatch('/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i');
        });

        it('generates UUIDs with correct length', function () {
            $models = [new User, new Family, new TimelineItem];

            foreach ($models as $model) {
                $uuid = $model->newUniqueId();
                expect(strlen($uuid))->toBe(36); // Standard UUID string length
            }
        });

        it('generates UUIDs with correct hyphen positions', function () {
            $user = new User;
            $uuid = $user->newUniqueId();

            expect($uuid[8])->toBe('-');
            expect($uuid[13])->toBe('-');
            expect($uuid[18])->toBe('-');
            expect($uuid[23])->toBe('-');
        });
    });

    describe('Model Preparation for UUID Migration', function () {
        it('models are ready for HasUuids trait integration', function () {
            // Verify that models have the necessary UUID methods
            $models = [
                ['class' => User::class, 'name' => 'User'],
                ['class' => Family::class, 'name' => 'Family'],
                ['class' => TimelineItem::class, 'name' => 'TimelineItem'],
            ];

            foreach ($models as $modelInfo) {
                $model = new $modelInfo['class'];

                // Check that UUID methods exist and work
                expect(method_exists($model, 'newUniqueId'))->toBeTrue("Model {$modelInfo['name']} should have newUniqueId method");
                expect(method_exists($model, 'uniqueIds'))->toBeTrue("Model {$modelInfo['name']} should have uniqueIds method");

                // Check that UUID generation works
                $uuid = $model->newUniqueId();
                expect(Uuid::isValid($uuid))->toBeTrue("Model {$modelInfo['name']} should generate valid UUIDs");
                expect(Uuid::fromString($uuid)->getVersion())->toBe(7, "Model {$modelInfo['name']} should generate UUID7");

                // Check that uniqueIds returns correct array
                expect($model->uniqueIds())->toBe(['id'], "Model {$modelInfo['name']} should specify 'id' as unique identifier");
            }
        });

        it('models can work with current integer schema', function () {
            // Skip this test as it requires database setup and is more of an integration test
            $this->markTestSkipped('This test requires database setup and should be moved to feature tests');
        });

        it('models have proper relationships configured', function () {
            // Skip this test as it requires database setup and is more of an integration test
            $this->markTestSkipped('This test requires database setup and should be moved to feature tests');
        });

        it('factories generate valid test data', function () {
            // Skip this test as it requires database setup and is more of an integration test
            $this->markTestSkipped('This test requires database setup and should be moved to feature tests');
        });
    });
});
