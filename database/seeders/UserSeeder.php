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
        // Create a family first
        $family = Family::create([
            'name' => 'The Smith Family',
            'child_name' => 'Emma Smith',
        ]);

        $adminUser = User::factory()->create([
            'name' => 'Mig',
            'email' => 'pimpmypixel@me.com',
            'password' => 'hejhejhej',
        ]);

        $father = User::factory()->create([
            'name' => 'John Father',
            'email' => 'father@example.com',
            'password' => 'password',
            'family_id' => $family->id,
        ]);

        $mother = User::factory()->create([
            'name' => 'Jane Mother',
            'email' => 'mother@example.com',
            'password' => 'password',
            'family_id' => $family->id,
        ]);
        
        $authority = User::factory()->create([
            'name' => 'DAFL Consultant',
            'email' => 'consultant@dafl.dk',
            'password' => 'password',
        ]);
        
        $other = User::factory()->create([
            'name' => 'Other Guardian',
            'email' => 'other@example.com',
            'password' => 'password',
        ]);
        
        $adminUser->assignRole('admin');
        $father->assignRole('father');
        $mother->assignRole('mother');
        $authority->assignRole('authority');
        $other->assignRole('other');
        
        // Create additional random users with random roles
        // $roles = ['father', 'mother', 'authority', 'other'];
        // User::factory(5)->create()->each(function ($user) use ($roles) {
        //     $user->assignRole(fake()->randomElement($roles));
        // });
    }
}