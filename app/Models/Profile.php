<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    protected $fillable = [
        'session_id',
        'user_id',
        'answers',
    ];

    protected $casts = [
        'answers' => 'array',
        'session_id' => 'string',
        'user_id' => 'string',
    ];

    /**
     * Get the user that owns the profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
