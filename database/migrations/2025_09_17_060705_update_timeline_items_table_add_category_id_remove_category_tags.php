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
        Schema::table('timeline_items', function (Blueprint $table) {
            $table->uuid('category_id')->nullable()->after('family_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');

            $table->dropColumn(['category', 'tags']);
        });
    }

    public function down(): void
    {
        Schema::table('timeline_items', function (Blueprint $table) {
            $table->string('category')->after('item_timestamp');
            $table->json('tags')->after('category');

            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
