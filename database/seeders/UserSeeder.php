<?php

namespace Database\Seeders;

use App\Models\Family;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'pimpmypixel@me.com',
            'password' => 'hejhejhej',
        ]);

        $socialWorker1 = User::factory()->create([
            'name' => 'DAFL Consultant #1',
            'email' => 'consultant1@dafl.dk',
            'password' => 'password',
        ]);

        $socialWorker2 = User::factory()->create([
            'name' => 'DAFL Consultant #2',
            'email' => 'consultant2@dafl.dk',
            'password' => 'password',
        ]);

        $other = User::factory()->create([
            'name' => 'Other Guardian',
            'email' => 'other@example.com',
            'password' => 'password',
        ]);

        $adminUser->assignRole('admin');
        $socialWorker2->assignRole('myndighed');
        $other->assignRole('andet');
        $socialWorker1->assignRole('myndighed');

        // Create 1 mother and 1 father for each family, and assign a random social worker to each family
        $families = Family::all();
        $socialWorkers = [$socialWorker1, $socialWorker2];

        foreach ($families as $index => $family) {
            $fatherFirst = fake()->firstName();
            $motherFirst = fake()->firstName();
            $father = User::factory()->create([
                'name' => $fatherFirst.' '.$family->name,
                'email' => strtolower($fatherFirst).'_'.strtolower($family->name).'@example.com',
                'password' => 'password',
                'family_id' => $family->id,
            ]);
            $father->assignRole('far');

            $mother = User::factory()->create([
                'name' => $motherFirst.' '.$family->name,
                'email' => strtolower($motherFirst).'_'.strtolower($family->name).'@example.com',
                'password' => 'password',
                'family_id' => $family->id,
            ]);
            $mother->assignRole('mor');

            // Assign a designated social worker to this family
            $designatedWorker = $socialWorkers[$index % count($socialWorkers)];

            // Set the designated social worker for this family
            $family->update(['created_by' => $designatedWorker->id]);

            // Also assign the social worker to this family (they can access it)
            $designatedWorker->family_id = $family->id;
            $designatedWorker->save();
        }
    }
}
