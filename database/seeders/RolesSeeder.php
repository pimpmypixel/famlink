<?php

namespace Database\Seeders;

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

        // Additional roles
        $temporaryRole = Role::firstOrCreate(['name' => 'temporary']);
        $approvedRole = Role::firstOrCreate(['name' => 'approved']);

        // Family roles
        $childRole = Role::firstOrCreate(['name' => 'barn']);
        $fatherRole = Role::firstOrCreate(['name' => 'far']);
        $motherRole = Role::firstOrCreate(['name' => 'mor']);
        $witnessRole = Role::firstOrCreate(['name' => 'vidne']);
        $otherRole = Role::firstOrCreate(['name' => 'andet']);

        // Authority and professional roles
        $caseWorkerRole = Role::firstOrCreate(['name' => 'sagsbehandler']);
        $lawyerRole = Role::firstOrCreate(['name' => 'advokat']);
        $psychiatristRole = Role::firstOrCreate(['name' => 'psykiater']);
    }
}
