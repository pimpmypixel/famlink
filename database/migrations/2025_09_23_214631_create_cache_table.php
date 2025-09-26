<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Use raw SQL with IF NOT EXISTS to avoid conflicts during container startup
        DB::statement('CREATE TABLE IF NOT EXISTS cache (key VARCHAR PRIMARY KEY, value TEXT, expiration INTEGER)');
        DB::statement('CREATE INDEX IF NOT EXISTS cache_expiration_index ON cache(expiration)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
    }
};
