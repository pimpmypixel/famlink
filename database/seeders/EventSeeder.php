<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Family;
use App\Models\Tag;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fix any existing timeline items without categories
        $this->fixExistingItemsWithoutCategories();

        // Create base timeline data (existing items)
        $baseTimelineData = $this->getBaseTimelineData();

        // Generate additional timeline items to reach hundreds of records
        $extendedTimelineData = $this->generateExtendedTimelineData(200); // Generate 200 additional items

        // Combine base and extended data
        $timelineData = array_merge($baseTimelineData, $extendedTimelineData);

        // Get users and families
        $families = Family::all();
        $allUsers = User::all();
        $socialWorkers = User::role('sagsbehandler')->get(); // Use caseworkers as the primary authority

        // Create timeline items
        $this->createTimelineItems($timelineData, $families, $allUsers, $socialWorkers);

        // Ensure each family has at least 3 items from social workers
        $this->createSocialWorkerItemsForFamilies($families, $socialWorkers);
    }

    /**
     * Fix any existing timeline items that don't have categories assigned
     */
    private function fixExistingItemsWithoutCategories(): void
    {
        $itemsWithoutCategories = Event::whereNull('category_id')->get();

        if ($itemsWithoutCategories->isEmpty()) {
            return;
        }

        $this->command->info("Found {$itemsWithoutCategories->count()} timeline items without categories. Fixing...");

        // Get or create default categories
        $defaultCategories = [
            'familieret' => Category::firstOrCreate(['name' => 'familieret']),
            'korrespondance' => Category::firstOrCreate(['name' => 'korrespondance']),
            'barnet' => Category::firstOrCreate(['name' => 'barnet']),
            'rapport' => Category::firstOrCreate(['name' => 'rapport']),
        ];

        foreach ($itemsWithoutCategories as $item) {
            // Assign a random category based on content analysis or just pick one
            $category = collect($defaultCategories)->random();

            $item->update(['category_id' => $category->id]);
        }

        $this->command->info("Fixed {$itemsWithoutCategories->count()} timeline items with categories.");
    }

    /**
     * Get the base timeline data (existing items)
     */
    private function getBaseTimelineData(): array
    {
        return [
            [
                'title' => 'Samværsaftale',
                'content' => 'Mor ønsker ændring af samværsaftalen, så Anna kan være hos hende i alle vinterferier.',
                'date' => '2025-01-12',
                'item_timestamp' => '2025-01-12 09:30:00',
                'category' => 'familieret',
                'tags' => ['samvær', 'aftale', 'ferie'],
            ],
            [
                'title' => 'Indkaldelse til møde',
                'content' => 'Familieretshuset har indkaldt begge forældre til digitalt møde om ændring af samværsaftalen.',
                'date' => '2025-01-18',
                'item_timestamp' => '2025-01-18 14:00:00',
                'category' => 'korrespondance',
                'tags' => ['møde', 'indkaldelse', 'samvær'],
            ],
            [
                'title' => 'Bekymring om skolearbejde',
                'content' => 'Far skriver til Familieretshuset, at Anna har svært ved at følge med i skolen, og at han ønsker en vurdering af barnets trivsel.',
                'date' => '2025-01-20',
                'item_timestamp' => '2025-01-20 18:15:00',
                'category' => 'barnet',
                'tags' => ['skole', 'trivsel', 'bekymring'],
            ],
            [
                'title' => 'Statusnotat fra Familieretshuset',
                'content' => 'Familieretshuset har udsendt statusnotat om barnets trivsel og anbefalet en børnesamtale.',
                'date' => '2025-01-23',
                'item_timestamp' => '2025-01-23 11:00:00',
                'category' => 'rapport',
                'tags' => ['status', 'barnesamtale', 'rapport'],
            ],
            [
                'title' => 'Barnesamtale planlagt',
                'content' => 'Der er aftalt en samtale med Anna den 1. februar kl. 10.00, hvor hun kan give sin mening til kende om samvær og bopæl.',
                'date' => '2025-01-25',
                'item_timestamp' => '2025-01-25 15:45:00',
                'category' => 'barnet',
                'tags' => ['barnesamtale', 'høring', 'barnetsStemme'],
            ],
            [
                'title' => 'Lægeerklæring fremsendt',
                'content' => 'Mor har sendt lægeerklæring til Familieretshuset vedrørende Annas søvnbesvær og behov for faste rutiner.',
                'date' => '2025-01-28',
                'item_timestamp' => '2025-01-28 09:10:00',
                'category' => 'korrespondance',
                'tags' => ['læge', 'rutiner', 'trivsel'],
            ],
            [
                'title' => 'Opfølgende møde med Familieretshuset',
                'content' => 'Der blev afholdt opfølgende møde med begge forældre, hvor mulige løsninger om fleksibelt samvær blev diskuteret.',
                'date' => '2025-02-02',
                'item_timestamp' => '2025-02-02 13:00:00',
                'category' => 'familieret',
                'tags' => ['opfølgning', 'møde', 'samvær'],
            ],
            [
                'title' => 'Vejledning om ferieplanlægning',
                'content' => 'Familieretshuset har sendt vejledning om planlægning af skoleferier, så begge forældre får indflydelse.',
                'date' => '2025-02-05',
                'item_timestamp' => '2025-02-05 10:20:00',
                'category' => 'vejledning',
                'tags' => ['ferie', 'vejledning', 'forældremyndighed'],
            ],
            [
                'title' => 'Anmodning om bopælssag',
                'content' => 'Far har indgivet anmodning om ændring af bopæl, da han ønsker, at Anna skal bo fast hos ham.',
                'date' => '2025-02-10',
                'item_timestamp' => '2025-02-10 16:45:00',
                'category' => 'familieret',
                'tags' => ['bopæl', 'anmodning', 'forældreansvar'],
            ],
            [
                'title' => 'Foreløbig afgørelse',
                'content' => 'Familieretshuset har truffet midlertidig afgørelse om, at nuværende samvær fortsætter, indtil endelig afgørelse træffes.',
                'date' => '2025-02-14',
                'item_timestamp' => '2025-02-14 12:00:00',
                'category' => 'afgørelse',
                'tags' => ['midlertidig', 'samvær', 'afgørelse'],
            ],
            [
                'title' => 'Skoleudtalelse indhentet',
                'content' => 'Familieretshuset har indhentet en udtalelse fra Annas klasselærer om hendes trivsel og udvikling.',
                'date' => '2025-02-18',
                'item_timestamp' => '2025-02-18 09:40:00',
                'category' => 'rapport',
                'tags' => ['skole', 'udtalelse', 'barnetsTrivsel'],
            ],
            [
                'title' => 'Endelig afgørelse truffet',
                'content' => 'Familieretshuset har truffet afgørelse om bopæl, hvor Anna skal fortsætte med at bo hos mor, med udvidet samvær hos far.',
                'date' => '2025-02-25',
                'item_timestamp' => '2025-02-25 14:30:00',
                'category' => 'afgørelse',
                'tags' => ['bopæl', 'samvær', 'familieret'],
            ],
            [
                'title' => 'Klage indgivet',
                'content' => 'Far har indgivet klage over afgørelsen og ønsker sagen indbragt for Familieretten.',
                'date' => '2025-03-02',
                'item_timestamp' => '2025-03-02 11:25:00',
                'category' => 'klage',
                'tags' => ['klage', 'familieret', 'bopæl'],
            ],
            [
                'title' => 'Børnesagkyndig udpeget',
                'content' => 'Familieretshuset har udpeget en børnesagkyndig til at vurdere Annas trivsel og samspil med begge forældre.',
                'date' => '2025-03-06',
                'item_timestamp' => '2025-03-06 09:00:00',
                'category' => 'rapport',
                'tags' => ['børnesagkyndig', 'trivsel', 'rapport'],
            ],
            [
                'title' => 'Nyt møde planlagt',
                'content' => 'Et retsmøde i Familieretten er blevet planlagt til den 15. marts med deltagelse af begge forældre og deres advokater.',
                'date' => '2025-03-10',
                'item_timestamp' => '2025-03-10 13:30:00',
                'category' => 'familieret',
                'tags' => ['møde', 'retsmøde', 'advokat'],
            ],
            [
                'title' => 'Barnets fritidsaktiviteter',
                'content' => 'Mor har indsendt oplysninger om Annas fritidsaktiviteter og venskaber for at understøtte hendes bopæl hos hende.',
                'date' => '2025-03-12',
                'item_timestamp' => '2025-03-12 17:15:00',
                'category' => 'barnet',
                'tags' => ['fritid', 'venner', 'trivsel'],
            ],
            [
                'title' => 'Observationsrapport',
                'content' => 'Den børnesagkyndige har afleveret en rapport efter observation af Anna sammen med begge forældre.',
                'date' => '2025-03-16',
                'item_timestamp' => '2025-03-16 10:40:00',
                'category' => 'rapport',
                'tags' => ['observation', 'barnet', 'rapport'],
            ],
            [
                'title' => 'Forældresamarbejdskursus',
                'content' => 'Begge forældre er blevet tilbudt kursus i samarbejde om børn efter skilsmisse.',
                'date' => '2025-03-20',
                'item_timestamp' => '2025-03-20 09:50:00',
                'category' => 'vejledning',
                'tags' => ['kursus', 'samarbejde', 'forældre'],
            ],
            [
                'title' => 'Status fra barnets psykolog',
                'content' => 'Familieretshuset har modtaget en statusudtalelse fra Annas psykolog om hendes trivsel og følelsesmæssige behov.',
                'date' => '2025-03-24',
                'item_timestamp' => '2025-03-24 14:20:00',
                'category' => 'rapport',
                'tags' => ['psykolog', 'trivsel', 'rapport'],
            ],
            [
                'title' => 'Retlig afgørelse',
                'content' => 'Familieretten har truffet en foreløbig afgørelse om bopæl, hvor sagen sendes tilbage til Familieretshuset til yderligere undersøgelse.',
                'date' => '2025-03-28',
                'item_timestamp' => '2025-03-28 12:10:00',
                'category' => 'afgørelse',
                'tags' => ['bopæl', 'familieret', 'afgørelse'],
            ],
            [
                'title' => 'Ekstra børnesamtale',
                'content' => 'Anna er blevet indkaldt til en ekstra samtale for at belyse hendes ønsker omkring bopæl og samvær.',
                'date' => '2025-04-01',
                'item_timestamp' => '2025-04-01 09:45:00',
                'category' => 'barnet',
                'tags' => ['barnesamtale', 'høring', 'barnetsStemme'],
            ],
            [
                'title' => 'Afsluttende rapport fremlagt',
                'content' => 'Den børnesagkyndige har afleveret sin endelige rapport til Familieretten.',
                'date' => '2025-04-05',
                'item_timestamp' => '2025-04-05 11:35:00',
                'category' => 'rapport',
                'tags' => ['rapport', 'børnesagkyndig', 'familieret'],
            ],
            [
                'title' => 'Endelig retlig afgørelse',
                'content' => 'Familieretten har truffet endelig afgørelse om bopæl og samvær, som begge forældre skal følge.',
                'date' => '2025-04-12',
                'item_timestamp' => '2025-04-12 15:00:00',
                'category' => 'afgørelse',
                'tags' => ['bopæl', 'samvær', 'endeligAfgørelse'],
            ],
            [
                'title' => 'Opfølgning efter afgørelse',
                'content' => 'Familieretshuset har planlagt opfølgende møde om tre måneder for at evaluere, hvordan ordningen fungerer.',
                'date' => '2025-04-15',
                'item_timestamp' => '2025-04-15 10:30:00',
                'category' => 'opfølgning',
                'tags' => ['opfølgning', 'samvær', 'familieret'],
            ],
        ];
    }

    /**
     * Generate extended timeline data for comprehensive testing
     */
    private function generateExtendedTimelineData(int $count): array
    {
        $categories = [
            'familieret', 'korrespondance', 'barnet', 'rapport', 'vejledning',
            'afgørelse', 'klage', 'opfølgning', 'familieret', 'barnet',
        ];

        $tagPool = [
            'samvær', 'bopæl', 'trivsel', 'skole', 'møde', 'rapport', 'afgørelse',
            'barnetsStemme', 'forældreansvar', 'familieret', 'korrespondance',
            'vejledning', 'opfølgning', 'klage', 'børnesagkyndig', 'psykolog',
            'advokat', 'retsmøde', 'fritid', 'venner', 'kursus', 'samarbejde',
        ];

        $titles = [
            'Opdatering om samvær', 'Ny korrespondance modtaget', 'Barnets udvikling',
            'Rapport fra møde', 'Vejledning om rettigheder', 'Afgørelse i sag',
            'Klage over beslutning', 'Opfølgning planlagt', 'Ny henvendelse',
            'Status på sag', 'Møde indkaldt', 'Dokumentation indsendt',
            'Udtalelse fra ekspert', 'Ændring i aftale', 'Evaluering af ordning',
        ];

        $extendedData = [];

        for ($i = 0; $i < $count; $i++) {
            $category = fake()->randomElement($categories);
            $numTags = fake()->numberBetween(1, 4);
            $selectedTags = fake()->randomElements($tagPool, $numTags);

            $extendedData[] = [
                'title' => fake()->randomElement($titles).' #'.($i + 1),
                'content' => fake()->paragraphs(fake()->numberBetween(1, 3), true),
                'date' => fake()->dateTimeBetween('-1 year', '+6 months')->format('Y-m-d'),
                'item_timestamp' => fake()->dateTimeBetween('-1 year', '+6 months')->format('Y-m-d H:i:s'),
                'category' => $category,
                'tags' => $selectedTags,
            ];
        }

        return $extendedData;
    }

    /**
     * Create timeline items
     */
    private function createTimelineItems(array $timelineData, $families, $allUsers, $socialWorkers): array
    {
        $timelineItems = [];

        foreach ($timelineData as $item) {
            $randomUser = $allUsers->random();
            $familyId = $randomUser->family_id ?? $families->random()->id;

            // Get category by name
            $category = Category::where('name', $item['category'])->first();
            if (! $category) {
                // Create category if it doesn't exist
                $category = Category::firstOrCreate(['name' => $item['category']]);
            }
            $categoryId = $category->id;

            $timelineItem = Event::create([
                'user_id' => $randomUser->id,
                'family_id' => $familyId,
                'category_id' => $categoryId,
                'title' => $item['title'],
                'content' => $item['content'],
                'date' => $item['date'],
                'item_timestamp' => $item['item_timestamp'],
                'is_urgent' => fake()->boolean(10), // 10% chance of being urgent
            ]);

            // Attach tags
            $tagIds = collect($item['tags'])->map(function ($tagName) {
                $tag = Tag::where('name', $tagName)->first();
                if (! $tag) {
                    $tag = Tag::firstOrCreate(['name' => $tagName]);
                }
                return $tag->id;
            })->toArray();
            $timelineItem->tags()->attach($tagIds);

            $timelineItems[] = $timelineItem;
        }

        return $timelineItems;
    }

    /**
     * Ensure each family has at least 3 items from social workers
     */
    private function createSocialWorkerItemsForFamilies($families, $socialWorkers): void
    {
        $socialWorkerTitles = [
            'Statusopdatering fra Familieretshuset',
            'Mødereferat',
            'Vurdering af børns trivsel',
            'Anbefalinger til forældresamarbejde',
            'Opfølgning på tidligere møde',
            'Rapport fra børnesagkyndig',
            'Vejledning om samvær',
            'Evaluering af aftaler',
            'Indstilling til Familieretten',
            'Orientering om sagsforløb',
        ];

        $socialWorkerContents = [
            'Familieretshuset har gennemgået sagen og kommer med følgende vurdering...',
            'På mødet blev der diskuteret muligheder for bedre samarbejde mellem forældrene...',
            'Børnenes trivsel er blevet vurderet, og der er behov for følgende tiltag...',
            'Der anbefales at forældrene deltager i kursus om samarbejde efter skilsmisse...',
            'Opfølgning på tidligere aftaler viser god fremgang i kommunikationen...',
            'Den børnesagkyndige har afgivet rapport med anbefalinger til videre forløb...',
            'Der gives vejledning om praktisk gennemførelse af samværsaftalen...',
            'Evalueringen viser at aftalerne fungerer tilfredsstillende for alle parter...',
            'Familieretshuset indstiller til Familieretten at godkende den foreslåede ordning...',
            'Sagen er nu i følgende fase med disse næste skridt...',
        ];

        foreach ($families as $family) {
            // Count existing social worker items for this family
            $existingSocialWorkerItems = Event::where('family_id', $family->id)
                ->whereHas('user', function ($query) {
                    $query->role('sagsbehandler');
                })
                ->count();

            // Create additional items if needed to reach at least 3
            $itemsToCreate = max(0, 3 - $existingSocialWorkerItems);

            for ($i = 0; $i < $itemsToCreate; $i++) {
                $socialWorker = $socialWorkers->random();
                $category = Category::inRandomOrder()->first();

                $timelineItem = Event::create([
                    'user_id' => $socialWorker->id,
                    'family_id' => $family->id,
                    'category_id' => $category->id,
                    'title' => fake()->randomElement($socialWorkerTitles),
                    'content' => fake()->randomElement($socialWorkerContents),
                    'date' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
                    'item_timestamp' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d H:i:s'),
                    'is_urgent' => fake()->boolean(5), // 5% chance of being urgent
                ]);

                // Add some tags
                $tags = Tag::inRandomOrder()->limit(fake()->numberBetween(1, 3))->get();
                $timelineItem->tags()->attach($tags->pluck('id')->toArray());
            }
        }
    }

    /**
     * Create categories from timeline data
     */
    private function createCategories(array $timelineData): array
    {
        $categories = [];
        $allCategories = collect($timelineData)->pluck('category')->unique();

        foreach ($allCategories as $categoryName) {
            $categories[$categoryName] = Category::firstOrCreate(['name' => $categoryName]);
        }

        return $categories;
    }

    /**
     * Create tags from timeline data
     */
    private function createTags(array $timelineData): array
    {
        $allTags = collect($timelineData)->pluck('tags')->flatten()->unique();
        $tags = [];

        foreach ($allTags as $tagName) {
            $tags[$tagName] = Tag::firstOrCreate(['name' => $tagName]);
        }

        return $tags;
    }
}
