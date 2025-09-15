<?php

namespace Database\Seeders;

use App\Models\Family;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class FamilySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

       $fam1 = Family::create([
            'id' => (string) Str::uuid(),
            'name' => 'Smith',
            'child_name' => 'Sandy',
        ]);

       $fam2 = Family::create([
            'id' => (string) Str::uuid(),
            'name' => 'Johnson',
            'child_name' => 'Dakota',
        ]);

    }
}
