<?php

namespace Database\Seeders;

use App\Models\Family;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create roles (or get existing ones)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $fatherRole = Role::firstOrCreate(['name' => 'far']);
        $motherRole = Role::firstOrCreate(['name' => 'mor']);
        $authorityRole = Role::firstOrCreate(['name' => 'myndighed']);
        $otherRole = Role::firstOrCreate(['name' => 'andet']);

    }
}
