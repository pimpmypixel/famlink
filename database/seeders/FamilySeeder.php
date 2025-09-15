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

        $familyNames = [
            ['name' => 'Smith', 'child_name' => 'Sandy'],
            ['name' => 'Johnson', 'child_name' => 'Dakota'],
            ['name' => 'Williams', 'child_name' => 'Taylor'],
            ['name' => 'Brown', 'child_name' => 'Morgan'],
            ['name' => 'Jones', 'child_name' => 'Casey'],
        ];

        foreach ($familyNames as $fam) {
            Family::create([
                'id' => (string) Str::uuid(),
                'name' => $fam['name'],
                'child_name' => $fam['child_name'],
            ]);
        }

    }
}
