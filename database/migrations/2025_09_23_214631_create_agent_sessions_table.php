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
        Schema::create('agent_sessions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('session_id')->index();
            $table->bigInteger('user_id')->nullable()->index()->comment('Optional link to users table');
            $table->bigInteger('agent_memory_id')->nullable()->index()->comment('Link to agent memory');
            $table->string('agent_name')->index();
            $table->json('state_data')->nullable();
            $table->timestamps();

            $table->unique(['session_id', 'agent_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_sessions');
    }
};
