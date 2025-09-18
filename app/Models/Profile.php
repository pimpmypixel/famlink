<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'session_id',
        'answers',
    ];

    protected $casts = [
        'answers' => 'array',
        'session_id' => 'string',
    ];
}
