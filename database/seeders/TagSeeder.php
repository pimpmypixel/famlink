<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            'samvær',
            'aftale',
            'ferie',
            'møde',
            'indkaldelse',
            'skole',
            'trivsel',
            'bekymring',
            'status',
            'barnesamtale',
            'høring',
            'barnetsStemme',
            'læge',
            'rutiner',
            'opfølgning',
            'vejledning',
            'forældremyndighed',
            'bopæl',
            'anmodning',
            'forældreansvar',
            'midlertidig',
            'afgørelse',
            'udtalelse',
            'barnetsTrivsel',
            'familieret',
            'retsmøde',
            'advokat',
            'fritid',
            'venner',
            'observation',
            'kursus',
            'samarbejde',
            'forældre',
            'psykolog',
            'endeligAfgørelse',
        ];

        foreach ($tags as $tagName) {
            Tag::firstOrCreate(['name' => $tagName]);
        }
    }
}
