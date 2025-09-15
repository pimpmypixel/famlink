<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'timeline_item_id',
        'user_id',
        'content',
    ];

    public function timelineItem()
    {
        return $this->belongsTo(TimelineItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
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
