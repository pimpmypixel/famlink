<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimelineItem extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    use HasFactory, HasUuids;
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

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
