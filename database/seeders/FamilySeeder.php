<?php

namespace Database\Seeders;

use App\Models\Family;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class FamilySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $firstFamily = Family::create([
            'name' => 'Johnson',
            'child_name' => 'Dakota',
        ]);

    }
}
