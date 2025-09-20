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
        // Create 50 diverse families with Danish names and child names
        $familyData = [
            // Original families
            ['name' => 'Smith', 'child_name' => 'Sandy'],
            ['name' => 'Johnson', 'child_name' => 'Dakota'],
            ['name' => 'Williams', 'child_name' => 'Taylor'],
            ['name' => 'Brown', 'child_name' => 'Morgan'],
            ['name' => 'Jones', 'child_name' => 'Casey'],

            // Danish families
            ['name' => 'Hansen', 'child_name' => 'Freja'],
            ['name' => 'Jensen', 'child_name' => 'Oliver'],
            ['name' => 'Nielsen', 'child_name' => 'Emma'],
            ['name' => 'Larsen', 'child_name' => 'William'],
            ['name' => 'Andersen', 'child_name' => 'Ida'],
            ['name' => 'Pedersen', 'child_name' => 'Noah'],
            ['name' => 'Christensen', 'child_name' => 'Sofia'],
            ['name' => 'Rasmussen', 'child_name' => 'Lucas'],
            ['name' => 'Jørgensen', 'child_name' => 'Ella'],
            ['name' => 'Madsen', 'child_name' => 'Oscar'],

            // More diverse families
            ['name' => 'Petersen', 'child_name' => 'Alma'],
            ['name' => 'Kristensen', 'child_name' => 'Victor'],
            ['name' => 'Olsen', 'child_name' => 'Clara'],
            ['name' => 'Thomsen', 'child_name' => 'Felix'],
            ['name' => 'Poulsen', 'child_name' => 'Luna'],
            ['name' => 'Christiansen', 'child_name' => 'Hugo'],
            ['name' => 'Knudsen', 'child_name' => 'Nova'],
            ['name' => 'Johansen', 'child_name' => 'Theo'],
            ['name' => 'Møller', 'child_name' => 'Astrid'],
            ['name' => 'Mortensen', 'child_name' => 'Axel'],

            // Additional families
            ['name' => 'Dam', 'child_name' => 'Isabella'],
            ['name' => 'Holm', 'child_name' => 'Liam'],
            ['name' => 'Jakobsen', 'child_name' => 'Maja'],
            ['name' => 'Eriksen', 'child_name' => 'Emil'],
            ['name' => 'Andreasen', 'child_name' => 'Olivia'],
            ['name' => 'Karlsen', 'child_name' => 'Benjamin'],
            ['name' => 'Frandsen', 'child_name' => 'Anna'],
            ['name' => 'Lauridsen', 'child_name' => 'Alexander'],
            ['name' => 'Lund', 'child_name' => 'Caroline'],
            ['name' => 'Bertelsen', 'child_name' => 'Sebastian'],

            // More families for comprehensive testing
            ['name' => 'Kjær', 'child_name' => 'Victoria'],
            ['name' => 'Bjerg', 'child_name' => 'Magnus'],
            ['name' => 'Fischer', 'child_name' => 'Josefine'],
            ['name' => 'Sørensen', 'child_name' => 'Valdemar'],
            ['name' => 'Gregersen', 'child_name' => 'Mathilde'],
            ['name' => 'Hedegaard', 'child_name' => 'Christian'],
            ['name' => 'Bach', 'child_name' => 'Rebecca'],
            ['name' => 'Friis', 'child_name' => 'Nikolaj'],
            ['name' => 'Søndergaard', 'child_name' => 'Laura'],
            ['name' => 'Bech', 'child_name' => 'Johan'],

            // Final batch
            ['name' => 'Lind', 'child_name' => 'Sarah'],
            ['name' => 'Koch', 'child_name' => 'Philip'],
            ['name' => 'Schou', 'child_name' => 'Camilla'],
            ['name' => 'Vestergaard', 'child_name' => 'Mikkel'],
            ['name' => 'Buch', 'child_name' => 'Katrine'],
            ['name' => 'Svendsen', 'child_name' => 'Anders'],
            ['name' => 'Hald', 'child_name' => 'Signe'],
            ['name' => 'Beck', 'child_name' => 'Tobias'],
            ['name' => 'Hermansen', 'child_name' => 'Julie'],
            ['name' => 'Thygesen', 'child_name' => 'Rasmus'],
        ];

        foreach ($familyData as $fam) {
            Family::create([
                'id' => (string) Str::uuid(),
                'name' => $fam['name'],
                'child_name' => $fam['child_name'],
            ]);
        }

        if ($this->command) {
            $this->command->info('Created ' . count($familyData) . ' families with diverse Danish names');
        }
    }
}
