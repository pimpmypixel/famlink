<?php

namespace App\Data;

use App\Models\Family;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class FamilyData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public ?string $child_name,
    ) {}

    public static function fromModel(Family $family): self
    {
        return new self(
            id: (string) $family->id,
            name: $family->name,
            child_name: $family->child_name,
        );
    }
}
