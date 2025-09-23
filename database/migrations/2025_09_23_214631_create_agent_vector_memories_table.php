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
        Schema::create('agent_vector_memories', function (Blueprint $table) {
            $table->char('id', 26)->primary();
            $table->string('agent_name')->index();
            $table->string('namespace')->default('default')->index();
            $table->text('content');
            $table->text('metadata')->nullable();
            $table->string('source')->nullable();
            $table->string('source_id')->nullable();
            $table->integer('chunk_index')->default(0);
            $table->string('embedding_provider');
            $table->string('embedding_model');
            $table->integer('embedding_dimensions');
            $table->string('embedding', 1536)->index('agent_vector_memories_embedding_idx');
            $table->float('embedding_norm')->nullable();
            $table->string('content_hash', 64)->index();
            $table->integer('token_count')->nullable();
            $table->timestamps();

            $table->unique(['agent_name', 'content_hash']);
            $table->index(['agent_name', 'namespace']);
            $table->index(['embedding_provider', 'embedding_model']);
            $table->index(['source', 'source_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_vector_memories');
    }
};
