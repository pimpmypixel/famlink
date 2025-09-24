<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('id');
            $table->string('last_name')->nullable()->after('first_name');
        });

        // Populate first_name and last_name from name using database-agnostic approach
        $connection = DB::getDriverName();

        if ($connection === 'pgsql') {
            // PostgreSQL syntax
            DB::statement("
                UPDATE users
                SET first_name = split_part(name, ' ', 1),
                    last_name = CASE
                        WHEN array_length(string_to_array(name, ' '), 1) > 1
                        THEN trim(substring(name from position(' ' in name) + 1))
                        ELSE ''
                    END
                WHERE name IS NOT NULL AND name != ''
            ");
        } elseif ($connection === 'sqlite') {
            // SQLite syntax
            DB::statement("
                UPDATE users
                SET first_name = substr(name, 1, instr(name || ' ', ' ') - 1),
                    last_name = CASE
                        WHEN instr(name, ' ') > 0
                        THEN trim(substr(name, instr(name, ' ') + 1))
                        ELSE ''
                    END
                WHERE name IS NOT NULL AND name != ''
            ");
        } elseif ($connection === 'mysql') {
            // MySQL syntax
            DB::statement("
                UPDATE users
                SET first_name = SUBSTRING_INDEX(name, ' ', 1),
                    last_name = TRIM(SUBSTRING(name, LENGTH(SUBSTRING_INDEX(name, ' ', 1)) + 1))
                WHERE name IS NOT NULL AND name != ''
            ");
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
        });

        // Restore name from first_name and last_name using database-agnostic approach
        $connection = DB::getDriverName();

        if ($connection === 'pgsql') {
            // PostgreSQL syntax
            DB::statement("
                UPDATE users
                SET name = CASE
                    WHEN last_name IS NOT NULL AND last_name != ''
                    THEN first_name || ' ' || last_name
                    ELSE first_name
                END
                WHERE first_name IS NOT NULL AND first_name != ''
            ");
        } elseif ($connection === 'sqlite') {
            // SQLite syntax
            DB::statement("
                UPDATE users
                SET name = CASE
                    WHEN last_name IS NOT NULL AND last_name != ''
                    THEN first_name || ' ' || last_name
                    ELSE first_name
                END
                WHERE first_name IS NOT NULL AND first_name != ''
            ");
        } elseif ($connection === 'mysql') {
            // MySQL syntax
            DB::statement("
                UPDATE users
                SET name = CONCAT_WS(' ', first_name, last_name)
                WHERE first_name IS NOT NULL OR last_name IS NOT NULL
            ");
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name']);
        });
    }
};
