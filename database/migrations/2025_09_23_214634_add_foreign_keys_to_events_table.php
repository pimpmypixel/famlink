<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->foreign(['category_id'])->references(['id'])->on('categories')->onUpdate('no action')->onDelete('set null');
            $table->foreign(['family_id'])->references(['id'])->on('families')->onUpdate('no action')->onDelete('set null');
            $table->foreign(['user_id'])->references(['id'])->on('users')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropForeign('events_category_id_foreign');
            $table->dropForeign('events_family_id_foreign');
            $table->dropForeign('events_user_id_foreign');
        });
    }
};
