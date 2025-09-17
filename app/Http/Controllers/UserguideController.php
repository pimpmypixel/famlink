<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class UserguideController extends Controller
{
    public function index()
    {
        return Inertia::render('guides/UserGuide');
    }
}
