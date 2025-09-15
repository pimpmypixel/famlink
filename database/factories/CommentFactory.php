<?php

namespace Database\Factories;

use App\Models\TimelineItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => (string) Str::uuid(),
            'timeline_item_id' => TimelineItem::factory(),
            'user_id' => User::factory(),
            'content' => $this->faker->sentence(),
        ];
    }
}
