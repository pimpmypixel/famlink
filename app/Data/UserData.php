<?php

namespace App\Data;

use App\Models\User;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $email,
        public string $role,
        public array $roles,
        public Lazy|FamilyData|null $family,
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: (string) $user->id,
            name: $user->name,
            email: $user->email,
            role: $user->getRoleNames()->first() ?? '',
            roles: $user->getRoleNames()->toArray(),
            family: Lazy::create(fn () => $user->family ? FamilyData::from($user->family) : null),
        );
    }
}
