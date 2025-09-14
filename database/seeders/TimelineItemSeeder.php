<?php

namespace Database\Seeders;

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

        $mockTimelineData = [
            [
                'title' => 'Soccer Practice Schedule',
                'content' => 'Emma has soccer practice every Tuesday and Thursday at 4 PM. I can handle pickup on Tuesdays.',
                'date' => '2024-01-15',
                'item_timestamp' => '2024-01-15 10:30:00',
                'category' => 'logistics',
                'tags' => ['soccer', 'schedule', 'pickup'],
            ],
            [
                'title' => 'Parent-Teacher Conference',
                'content' => 'Scheduled meeting with Ms. Rodriguez for Thursday at 3 PM to discuss Emma\'s progress in math.',
                'date' => '2024-01-16',
                'item_timestamp' => '2024-01-16 14:20:00',
                'category' => 'parenting',
                'tags' => ['school', 'meeting', 'math'],
            ],
            [
                'title' => 'Co-Parenting Session Notes',
                'content' => 'Discussed communication strategies and established guidelines for consistent bedtime routines across both households.',
                'date' => '2024-01-18',
                'item_timestamp' => '2024-01-18 16:00:00',
                'category' => 'consultation',
                'tags' => ['communication', 'bedtime', 'consistency'],
            ],
            [
                'title' => 'Medical Appointment',
                'content' => 'Emma has a dentist appointment on Friday at 2 PM. I\'ll take her and send you the report.',
                'date' => '2024-01-20',
                'item_timestamp' => '2024-01-20 09:15:00',
                'category' => 'logistics',
                'tags' => ['medical', 'dentist', 'appointment'],
            ],
            [
                'title' => 'Behavioral Concerns',
                'content' => 'Emma has been having trouble with homework completion. We should discuss strategies to help her stay focused.',
                'date' => '2024-01-22',
                'item_timestamp' => '2024-01-22 19:30:00',
                'category' => 'parenting',
                'tags' => ['homework', 'behavior', 'focus'],
            ],
            [
                'title' => 'Homework Strategy Recommendations',
                'content' => 'Based on our discussion, I recommend implementing a structured homework time with 15-minute breaks every 30 minutes.',
                'date' => '2024-01-25',
                'item_timestamp' => '2024-01-25 11:00:00',
                'category' => 'consultation',
                'tags' => ['homework', 'strategy', 'structure'],
            ],
        ];

        foreach ($mockTimelineData as $item) {
            $user = $fam->users()->inRandomOrder()->first();
            
            if ($user) {
                // Get the user's role, defaulting to 'other' if no role
                $userRole = $user->getRoleNames()->first();
                $author = $userRole && in_array($userRole, ['father', 'mother', 'authority']) ? $userRole : 'other';
                
                TimelineItem::create([
                    'user_id' => $user->id,
                    ...$item,
                ]);
            }
        }
    }
}
