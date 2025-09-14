<?php

namespace Database\Seeders;

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
        // Get the first user or create one for seeding
        $user = User::first() ?? User::factory()->create();

        $mockTimelineData = [
            [
                'author' => 'father',
                'title' => 'Soccer Practice Schedule',
                'content' => 'Emma has soccer practice every Tuesday and Thursday at 4 PM. I can handle pickup on Tuesdays.',
                'date' => '2024-01-15',
                'item_timestamp' => '2024-01-15 10:30:00',
                'category' => 'logistics',
                'tags' => ['soccer', 'schedule', 'pickup'],
            ],
            [
                'author' => 'mother',
                'title' => 'Parent-Teacher Conference',
                'content' => 'Scheduled meeting with Ms. Rodriguez for Thursday at 3 PM to discuss Emma\'s progress in math.',
                'date' => '2024-01-16',
                'item_timestamp' => '2024-01-16 14:20:00',
                'category' => 'parenting',
                'tags' => ['school', 'meeting', 'math'],
            ],
            [
                'author' => 'consultant',
                'title' => 'Co-Parenting Session Notes',
                'content' => 'Discussed communication strategies and established guidelines for consistent bedtime routines across both households.',
                'date' => '2024-01-18',
                'item_timestamp' => '2024-01-18 16:00:00',
                'category' => 'consultation',
                'tags' => ['communication', 'bedtime', 'consistency'],
            ],
            [
                'author' => 'father',
                'title' => 'Medical Appointment',
                'content' => 'Emma has a dentist appointment on Friday at 2 PM. I\'ll take her and send you the report.',
                'date' => '2024-01-20',
                'item_timestamp' => '2024-01-20 09:15:00',
                'category' => 'logistics',
                'tags' => ['medical', 'dentist', 'appointment'],
            ],
            [
                'author' => 'mother',
                'title' => 'Behavioral Concerns',
                'content' => 'Emma has been having trouble with homework completion. We should discuss strategies to help her stay focused.',
                'date' => '2024-01-22',
                'item_timestamp' => '2024-01-22 19:30:00',
                'category' => 'parenting',
                'tags' => ['homework', 'behavior', 'focus'],
            ],
            [
                'author' => 'consultant',
                'title' => 'Homework Strategy Recommendations',
                'content' => 'Based on our discussion, I recommend implementing a structured homework time with 15-minute breaks every 30 minutes.',
                'date' => '2024-01-25',
                'item_timestamp' => '2024-01-25 11:00:00',
                'category' => 'consultation',
                'tags' => ['homework', 'strategy', 'structure'],
            ],
        ];

        foreach ($mockTimelineData as $item) {
            TimelineItem::create([
                'user_id' => $user->id,
                ...$item,
            ]);
        }
    }
}
