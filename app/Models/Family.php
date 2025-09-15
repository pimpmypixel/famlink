<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Family extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'name',
        'child_name',
        'created_by',
    ];

    /**
     * Get the users that belong to this family.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the timeline items for this family.
     */
    public function timelineItems(): HasMany
    {
        return $this->hasMany(TimelineItem::class);
    }

    /**
     * Get the user who created this family.
     */
   /*  public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    } */

    /**
     * Get the user who created this family.
     */
    public function socialWorker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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
