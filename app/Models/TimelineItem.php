<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimelineItem extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'family_id',
        'category_id',
        'author',
        'title',
        'content',
        'date',
        'item_timestamp',
        'is_urgent',
        'attachments',
        'linked_items',
    ];

    protected $casts = [
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

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'timeline_item_tag');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
