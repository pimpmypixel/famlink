<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimelineItem extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
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

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }
}
