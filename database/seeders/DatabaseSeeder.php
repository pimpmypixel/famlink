<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $fatherRole = Role::create(['name' => 'father']);
        $motherRole = Role::create(['name' => 'mother']);
        $authorityRole = Role::create(['name' => 'authority']);
        $otherRole = Role::create(['name' => 'other']);

        // Create the main admin user
        $adminUser = User::factory()->create([
            'name' => 'Mig',
            'email' => 'pimpmypixel@me.com',
            'password' => 'hejhejhej',
        ]);
        $adminUser->assignRole('admin');

        // Create sample users for each role type
        $father = User::factory()->create([
            'name' => 'John Father',
            'email' => 'father@example.com',
            'password' => 'password',
        ]);
        $father->assignRole('father');

        $mother = User::factory()->create([
            'name' => 'Jane Mother',
            'email' => 'mother@example.com',
            'password' => 'password',
        ]);
        $mother->assignRole('mother');

        $authority = User::factory()->create([
            'name' => 'DAFL Consultant',
            'email' => 'consultant@dafl.dk',
            'password' => 'password',
        ]);
        $authority->assignRole('authority');

        $other = User::factory()->create([
            'name' => 'Other Guardian',
            'email' => 'other@example.com',
            'password' => 'password',
        ]);
        $other->assignRole('other');

        // Create additional random users with random roles
        $roles = ['father', 'mother', 'authority', 'other'];
        User::factory(5)->create()->each(function ($user) use ($roles) {
            $user->assignRole(fake()->randomElement($roles));
        });
    }
}
