<?php

namespace App\Data;

use Spatie\LaravelData\DataCollection;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TagDataCollection extends DataCollection
{
    public static function dataClass(): string
    {
        return TagData::class;
    }
}
