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
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('title');
            $table->text('content');
            $table->date('date');
            $table->timestamp('item_timestamp');
            $table->timestamps();
            $table->uuid('family_id')->nullable();
            $table->json('attachments')->nullable();
            $table->uuid('category_id')->nullable();
            $table->string('author')->nullable();
            $table->boolean('is_urgent')->default(false);
            $table->json('linked_items')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
