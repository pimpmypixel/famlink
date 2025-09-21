<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Family;
use App\Models\Tag;
use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class TimelineItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create base timeline data (existing items)
        $baseTimelineData = $this->getBaseTimelineData();

        // Generate additional timeline items to reach hundreds of records
        $extendedTimelineData = $this->generateExtendedTimelineData(200); // Generate 200 additional items

        // Combine base and extended data
        $timelineData = array_merge($baseTimelineData, $extendedTimelineData);

        // Create categories and tags
        $categories = $this->createCategories($timelineData);
        $tags = $this->createTags($timelineData);

        // Get users and families
        $families = Family::all();
        $allUsers = User::all();
        $socialWorkers = User::role('myndighed')->get();

        // Create timeline items
        $timelineItems = $this->createTimelineItems($timelineData, $categories, $tags, $families, $allUsers, $socialWorkers);

        // Create comments and replies
        $this->createCommentsAndReplies($timelineItems, $socialWorkers);
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
            'afgørelse', 'klage', 'opfølgning', 'familieret', 'barnet'
        ];

        $tagPool = [
            'samvær', 'bopæl', 'trivsel', 'skole', 'møde', 'rapport', 'afgørelse',
            'barnetsStemme', 'forældreansvar', 'familieret', 'korrespondance',
            'vejledning', 'opfølgning', 'klage', 'børnesagkyndig', 'psykolog',
            'advokat', 'retsmøde', 'fritid', 'venner', 'kursus', 'samarbejde'
        ];

        $titles = [
            'Opdatering om samvær', 'Ny korrespondance modtaget', 'Barnets udvikling',
            'Rapport fra møde', 'Vejledning om rettigheder', 'Afgørelse i sag',
            'Klage over beslutning', 'Opfølgning planlagt', 'Ny henvendelse',
            'Status på sag', 'Møde indkaldt', 'Dokumentation indsendt',
            'Udtalelse fra ekspert', 'Ændring i aftale', 'Evaluering af ordning'
        ];

        $extendedData = [];

        for ($i = 0; $i < $count; $i++) {
            $category = fake()->randomElement($categories);
            $numTags = fake()->numberBetween(1, 4);
            $selectedTags = fake()->randomElements($tagPool, $numTags);

            $extendedData[] = [
                'title' => fake()->randomElement($titles) . ' #' . ($i + 1),
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

    /**
     * Create timeline items
     */
    private function createTimelineItems(array $timelineData, array $categories, array $tags, $families, $allUsers, $socialWorkers): array
    {
        $timelineItems = [];

        foreach ($timelineData as $item) {
            $randomUser = $allUsers->random();
            $familyId = $randomUser->family_id ?? $families->random()->id;

            $timelineItem = TimelineItem::create([
                'user_id' => $randomUser->id,
                'family_id' => $familyId,
                'category_id' => $categories[$item['category']]->id,
                'title' => $item['title'],
                'content' => $item['content'],
                'date' => $item['date'],
                'item_timestamp' => $item['item_timestamp'],
                'is_urgent' => fake()->boolean(10), // 10% chance of being urgent
            ]);

            // Attach tags
            $tagIds = collect($item['tags'])->map(fn ($tagName) => $tags[$tagName]->id)->toArray();
            $timelineItem->tags()->attach($tagIds);

            $timelineItems[] = $timelineItem;
        }

        return $timelineItems;
    }

    /**
     * Create comments and replies for timeline items
     */
    private function createCommentsAndReplies(array $timelineItems, $socialWorkers): void
    {
        foreach ($timelineItems as $timelineItem) {
            // Get users who can comment on this timeline item
            $familyUsers = $timelineItem->family?->users ?? collect();
            $allowedUsers = $familyUsers->merge($socialWorkers)->unique('id');

            if ($allowedUsers->isEmpty()) continue;

            // Create at least 1 comment per timeline item (guaranteed)
            $numComments = fake()->numberBetween(1, 5);
            $comments = [];

            for ($i = 0; $i < $numComments; $i++) {
                $commentUser = $allowedUsers->random();
                $comment = Comment::create([
                    'timeline_item_id' => $timelineItem->id,
                    'user_id' => $commentUser->id,
                    'content' => fake()->paragraph(),
                    'is_private' => fake()->boolean(5), // 5% chance of being private
                ]);
                $comments[] = $comment;
            }

            // Create at least 1 reply for each comment (guaranteed)
            foreach ($comments as $comment) {
                $numReplies = fake()->numberBetween(1, 3); // Guaranteed at least 1 reply
                $replyUsers = $allowedUsers->filter(fn ($user) => $user->id !== $comment->user_id);

                if ($replyUsers->isNotEmpty()) {
                    for ($i = 0; $i < $numReplies; $i++) {
                        $replyUser = $replyUsers->random();
                        Comment::create([
                            'timeline_item_id' => $timelineItem->id,
                            'user_id' => $replyUser->id,
                            'parent_comment_id' => $comment->id,
                            'content' => fake()->paragraph(),
                            'is_private' => fake()->boolean(3), // 3% chance of being private
                        ]);
                    }
                } else {
                    // If no other users available, create a reply from a social worker
                    $replyUser = $socialWorkers->where('id', '!=', $comment->user_id)->first() ?? $socialWorkers->first();
                    if ($replyUser) {
                        Comment::create([
                            'timeline_item_id' => $timelineItem->id,
                            'user_id' => $replyUser->id,
                            'parent_comment_id' => $comment->id,
                            'content' => fake()->paragraph(),
                            'is_private' => false,
                        ]);
                    }
                }
            }
        }
    }
}
