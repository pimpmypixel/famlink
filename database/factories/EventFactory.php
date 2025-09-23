<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraph(),
            'date' => fake()->date(),
            'item_timestamp' => fake()->dateTime(),
        ];
    }

    /**
     * Indicate that the timeline item is urgent.
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_urgent' => true,
        ]);
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Event $event) {
            // Get existing tags or create new ones if needed
            $existingTags = \App\Models\Tag::all();
            $tagsToAttach = collect();

            // Try to use existing tags first
            if ($existingTags->count() >= 3) {
                $tagsToAttach = $existingTags->random(min(3, $existingTags->count()));
            } else {
                // If we don't have enough existing tags, create new ones
                $tagsNeeded = fake()->numberBetween(1, 3) - $existingTags->count();
                if ($tagsNeeded > 0) {
                    $newTags = \App\Models\Tag::factory()->count($tagsNeeded)->create();
                    $tagsToAttach = $existingTags->merge($newTags);
                } else {
                    $tagsToAttach = $existingTags->random(min(3, $existingTags->count()));
                }
            }

            $event->tags()->attach($tagsToAttach->pluck('id'));
        });
    }

    /**
     * Set a specific category for the timeline item.
     */
    public function category(string $categoryName): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => Category::where('name', $categoryName)->first()?->id ?? Category::factory()->create(['name' => $categoryName])->id,
        ]);
    }
}
