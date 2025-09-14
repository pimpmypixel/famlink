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
        $fatherRole = Role::firstOrCreate(['name' => 'father']);
        $motherRole = Role::firstOrCreate(['name' => 'mother']);
        $authorityRole = Role::firstOrCreate(['name' => 'authority']);
        $otherRole = Role::firstOrCreate(['name' => 'other']);

    }
}
