<?php


namespace Database\Seeders;

use App\Models\Comment;
use Illuminate\Support\Str;
use App\Models\Family;
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
        // Get the first family with users
        $fam = Family::with('users')->whereHas('users')->first();

        if (!$fam) {
            // If no family with users exists, skip seeding
            return;
        }

        $timelineData = [
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
            ]
        ];


        $timelineItems = [];
        foreach ($timelineData as $item) {
            $user = $fam->users()->inRandomOrder()->first();
            if ($user) {
                $insert = [
                    'user_id' => $user->id,
                    ...$item,
                ];
                $timelineItems[] = TimelineItem::create($insert);
            }
        }

        // Generate 30 comments and relate them randomly to timeline items and users
        $allUsers = User::all();
        $allTimelineItems = TimelineItem::all();
        for ($i = 0; $i < 30; $i++) {
            $randomTimelineItem = $allTimelineItems->random();
            $randomUser = $allUsers->random();
            Comment::create([
                'timeline_item_id' => $randomTimelineItem->id,
                'user_id' => $randomUser->id,
                'content' => 'Kommentar #' . ($i + 1) . ' - ' . Str::random(20),
            ]);
        }
    }
}
