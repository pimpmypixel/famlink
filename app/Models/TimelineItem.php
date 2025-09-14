<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimelineItem extends Model
{
    protected $fillable = [
        'user_id',
        'author',
        'title',
        'content',
        'date',
        'item_timestamp',
        'category',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'date' => 'date',
        'item_timestamp' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
