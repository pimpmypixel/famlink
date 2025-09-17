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
        $timelineData =
            [
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
                // --- New entries below (to double length) ---
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

        // First, create categories from the seeder data
        $categories = [];
        $allCategories = collect($timelineData)->pluck('category')->unique();
        foreach ($allCategories as $categoryName) {
            $categories[$categoryName] = Category::firstOrCreate(['name' => $categoryName]);
        }

        // Create tags from the seeder data
        $allTags = collect($timelineData)->pluck('tags')->flatten()->unique();
        $tags = [];
        foreach ($allTags as $tagName) {
            $tags[$tagName] = Tag::firstOrCreate(['name' => $tagName]);
        }

        $families = Family::all();
        $allUsers = User::all();
        $socialWorkers = User::role('myndighed')->get();

        $timelineItems = [];

        // First, ensure each family has the required minimum items from parents and social workers
        foreach ($families as $family) {
            $familyUsers = $family->users;
            $father = $familyUsers->first(function ($user) {
                return $user->hasRole('far');
            });
            $mother = $familyUsers->first(function ($user) {
                return $user->hasRole('mor');
            });

            // Get the designated social worker for this family
            $designatedSocialWorker = $family->socialWorker;

            // Ensure at least 2 items from father
            if ($father) {
                for ($i = 0; $i < 2; $i++) {
                    $item = collect($timelineData)->random();
                    $timelineItem = TimelineItem::create([
                        'user_id' => $father->id,
                        'family_id' => $family->id,
                        'category_id' => $categories[$item['category']]->id,
                        'title' => $item['title'],
                        'content' => $item['content'],
                        'date' => $item['date'],
                        'item_timestamp' => $item['item_timestamp'],
                    ]);

                    // Attach tags
                    $tagIds = collect($item['tags'])->map(fn ($tagName) => $tags[$tagName]->id)->toArray();
                    $timelineItem->tags()->attach($tagIds);

                    $timelineItems[] = $timelineItem;
                }
            }

            // Ensure at least 2 items from mother
            if ($mother) {
                for ($i = 0; $i < 2; $i++) {
                    $item = collect($timelineData)->random();
                    $timelineItem = TimelineItem::create([
                        'user_id' => $mother->id,
                        'family_id' => $family->id,
                        'category_id' => $categories[$item['category']]->id,
                        'title' => $item['title'],
                        'content' => $item['content'],
                        'date' => $item['date'],
                        'item_timestamp' => $item['item_timestamp'],
                    ]);

                    // Attach tags
                    $tagIds = collect($item['tags'])->map(fn ($tagName) => $tags[$tagName]->id)->toArray();
                    $timelineItem->tags()->attach($tagIds);

                    $timelineItems[] = $timelineItem;
                }
            }

            // Ensure at least 2 items from the designated social worker
            if ($designatedSocialWorker) {
                for ($i = 0; $i < 2; $i++) {
                    $item = collect($timelineData)->random();
                    $timelineItem = TimelineItem::create([
                        'user_id' => $designatedSocialWorker->id,
                        'family_id' => $family->id,
                        'category_id' => $categories[$item['category']]->id,
                        'title' => $item['title'],
                        'content' => $item['content'],
                        'date' => $item['date'],
                        'item_timestamp' => $item['item_timestamp'],
                    ]);

                    // Attach tags
                    $tagIds = collect($item['tags'])->map(fn ($tagName) => $tags[$tagName]->id)->toArray();
                    $timelineItem->tags()->attach($tagIds);

                    $timelineItems[] = $timelineItem;
                }
            } else {
                // Fallback: if no designated social worker, use any social worker
                $fallbackWorker = $socialWorkers->first();
                if ($fallbackWorker) {
                    for ($i = 0; $i < 2; $i++) {
                        $item = collect($timelineData)->random();
                        $timelineItem = TimelineItem::create([
                            'user_id' => $fallbackWorker->id,
                            'family_id' => $family->id,
                            'category_id' => $categories[$item['category']]->id,
                            'title' => $item['title'],
                            'content' => $item['content'],
                            'date' => $item['date'],
                            'item_timestamp' => $item['item_timestamp'],
                        ]);

                        // Attach tags
                        $tagIds = collect($item['tags'])->map(fn ($tagName) => $tags[$tagName]->id)->toArray();
                        $timelineItem->tags()->attach($tagIds);

                        $timelineItems[] = $timelineItem;
                    }
                }
            }
        }

        // Fill remaining items with random users to reach total count
        $remainingItems = count($timelineData) - count($timelineItems);
        for ($i = 0; $i < $remainingItems; $i++) {
            $item = collect($timelineData)->random();
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
            ]);

            // Attach tags
            $tagIds = collect($item['tags'])->map(fn ($tagName) => $tags[$tagName]->id)->toArray();
            $timelineItem->tags()->attach($tagIds);

            $timelineItems[] = $timelineItem;
        }

        // Ensure each timeline item has at least 1 comment from family members or social workers
        $allUsers = User::all();
        $allTimelineItems = TimelineItem::all();
        $socialWorkers = User::role('myndighed')->get();

        // First, create at least 1 comment for each timeline item
        foreach ($allTimelineItems as $timelineItem) {
            // Get users who can comment on this timeline item:
            // 1. Users in the same family as the timeline item
            // 2. Social workers
            $familyUsers = $timelineItem->family?->users ?? collect();
            $allowedUsers = $familyUsers->merge($socialWorkers)->unique('id');

            if ($allowedUsers->isNotEmpty()) {
                $randomUser = $allowedUsers->random();
                Comment::create([
                    'timeline_item_id' => $timelineItem->id,
                    'user_id' => $randomUser->id,
                    'content' => fake()->paragraph(),
                ]);
            }
        }

        // Generate additional random comments to increase engagement
        for ($i = 0; $i < 30; $i++) {
            $randomTimelineItem = $allTimelineItems->random();

            // Get users who can comment on this timeline item:
            // 1. Users in the same family as the timeline item
            // 2. Social workers
            $familyUsers = $randomTimelineItem->family?->users ?? collect();
            $allowedUsers = $familyUsers->merge($socialWorkers)->unique('id');

            if ($allowedUsers->isNotEmpty()) {
                $randomUser = $allowedUsers->random();
                Comment::create([
                    'timeline_item_id' => $randomTimelineItem->id,
                    'user_id' => $randomUser->id,
                    'content' => fake()->paragraph(),
                ]);
            }
        }

        // Generate replies for at least half of the comments randomly
        $allComments = Comment::all();
        $commentsToReplyTo = $allComments->random(min((int) ceil($allComments->count() / 2), $allComments->count()));

        foreach ($commentsToReplyTo as $parentComment) {
            $timelineItem = $parentComment->timelineItem;

            // Get users who can reply to this comment (same as those who can comment)
            $familyUsers = $timelineItem->family?->users ?? collect();
            $allowedUsers = $familyUsers->merge($socialWorkers)->unique('id');

            // Remove the original comment author to ensure different users reply
            $replyUsers = $allowedUsers->filter(function ($user) use ($parentComment) {
                return $user->id !== $parentComment->user_id;
            });

            if ($replyUsers->isNotEmpty()) {
                // Create 1-3 replies per comment
                $numberOfReplies = fake()->numberBetween(1, 3);

                for ($i = 0; $i < $numberOfReplies; $i++) {
                    $replyUser = $replyUsers->random();

                    // Generate different types of reply content
                    $replyTypes = [
                        'Jeg er enig i dette punkt.',
                        'Tak for at påpege dette.',
                        'Kan du uddybe dette nærmere?',
                        'Jeg har en anden oplevelse med dette.',
                        'Det er vigtigt at tage højde for dette.',
                        'Jeg støtter denne holdning.',
                        'Har du flere detaljer om dette?',
                        'Det giver god mening.',
                        'Jeg vil gerne høre mere om dette.',
                        'Det er en god pointe.',
                        'Jeg er uenig i denne del.',
                        'Kan vi drøfte dette videre?',
                        'Det er værd at overveje.',
                        'Jeg har lignende erfaringer.',
                        'Det er positivt at adressere dette.',
                    ];

                    $replyContent = fake()->randomElement($replyTypes) . ' ' . fake()->sentence();

                    Comment::create([
                        'timeline_item_id' => $parentComment->timeline_item_id,
                        'user_id' => $replyUser->id,
                        'parent_comment_id' => $parentComment->id,
                        'content' => $replyContent,
                    ]);
                }
            }
        }

        // Generate some nested replies (replies to replies) for more realistic conversation threads
        $allCommentsWithReplies = Comment::whereNotNull('parent_comment_id')->get();

        if ($allCommentsWithReplies->isNotEmpty()) {
            $repliesToReplyTo = $allCommentsWithReplies->random(min(10, $allCommentsWithReplies->count()));

            foreach ($repliesToReplyTo as $parentReply) {
                $timelineItem = $parentReply->timelineItem;

                // Get users who can reply
                $familyUsers = $timelineItem->family?->users ?? collect();
                $allowedUsers = $familyUsers->merge($socialWorkers)->unique('id');

                // Remove the original reply author
                $nestedReplyUsers = $allowedUsers->filter(function ($user) use ($parentReply) {
                    return $user->id !== $parentReply->user_id;
                });

                if ($nestedReplyUsers->isNotEmpty()) {
                    $nestedReplyUser = $nestedReplyUsers->random();

                    $nestedReplyTypes = [
                        'Det er en god uddybning.',
                        'Jeg forstår dit synspunkt bedre nu.',
                        'Tak for at forklare det.',
                        'Det giver mening i denne kontekst.',
                        'Jeg kan se hvor du kommer fra.',
                        'Det er nyttigt at vide.',
                        'Det hjælper med at forstå situationen.',
                        'Tak for perspektivet.',
                        'Det er en konstruktiv tilgang.',
                        'Jeg værdsætter din indsigt.',
                    ];

                    $nestedReplyContent = fake()->randomElement($nestedReplyTypes) . ' ' . fake()->sentence();

                    Comment::create([
                        'timeline_item_id' => $parentReply->timeline_item_id,
                        'user_id' => $nestedReplyUser->id,
                        'parent_comment_id' => $parentReply->id,
                        'content' => $nestedReplyContent,
                    ]);
                }
            }
        }
    }
}
