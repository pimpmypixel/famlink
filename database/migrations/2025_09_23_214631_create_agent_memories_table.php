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
        Schema::create('agent_memories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('agent_name')->index();
            $table->bigInteger('user_id')->nullable()->index()->comment('Optional link to users table for user-specific memories');
            $table->text('memory_summary')->nullable()->comment('Summarized knowledge from all sessions');
            $table->json('memory_data')->nullable()->comment('Structured memory data, facts, preferences, etc.');
            $table->json('key_learnings')->nullable()->comment('Important insights learned across sessions');
            $table->integer('total_sessions')->default(0)->comment('Total number of sessions this memory encompasses');
            $table->timestamp('last_session_at')->nullable()->comment('When the last session occurred');
            $table->timestamp('memory_updated_at')->nullable()->comment('When memory was last updated/summarized');
            $table->timestamps();

            $table->index(['agent_name', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_memories');
    }
};
