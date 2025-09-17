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
        Schema::create('timeline_item_tag', function (Blueprint $table) {
            $table->uuid('timeline_item_id');
            $table->uuid('tag_id');
            $table->timestamps();

            $table->primary(['timeline_item_id', 'tag_id']);
            $table->foreign('timeline_item_id')->references('id')->on('timeline_items')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timeline_item_tag');
    }
};
