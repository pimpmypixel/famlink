<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimelineItem extends Model
{
    protected $fillable = [
        'user_id',
        'family_id',
        'author',
        'title',
        'content',
        'date',
        'item_timestamp',
        'category',
        'tags',
        'is_urgent',
        'attachments',
        'linked_items',
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
        'item_timestamp' => 'datetime',
        'is_urgent' => 'boolean',
        'attachments' => 'array',
        'linked_items' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }
}
