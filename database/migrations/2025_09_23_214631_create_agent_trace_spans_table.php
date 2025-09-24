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
        Schema::create('agent_trace_spans', function (Blueprint $table) {
            $table->string('id', 26)->primary()->comment('ULID primary key for this span');
            $table->string('trace_id', 26)->index()->comment('ULID identifying the entire agent run trace');
            $table->string('parent_span_id', 26)->nullable()->index()->comment('Parent span ID for hierarchy, null for root spans');
            $table->string('span_id', 26)->unique()->comment('Unique ULID for this specific span');
            $table->string('session_id')->index()->comment('Session ID from AgentContext');
            $table->string('agent_name')->index()->comment('Name of the agent executing this span');
            $table->string('type', 50)->index()->comment('Type of operation: agent_run, llm_call, tool_call, sub_agent_delegation');
            $table->string('name')->comment('Specific name: model name, tool name, sub-agent name, etc.');
            $table->json('input')->nullable()->comment('Input data for the operation');
            $table->json('output')->nullable()->comment('Result/output of the operation');
            $table->json('metadata')->nullable()->comment('Additional contextual information');
            $table->string('status', 20)->default('running')->index()->comment('Execution status: running, success, error');
            $table->text('error_message')->nullable()->comment('Error message if status is error');
            $table->decimal('start_time', 16, 6)->comment('Start timestamp with microseconds');
            $table->decimal('end_time', 16, 6)->nullable()->comment('End timestamp with microseconds');
            $table->integer('duration_ms')->nullable()->index()->comment('Duration in milliseconds');
            $table->timestamps();

            $table->index(['agent_name', 'type', 'start_time'], 'agent_type_chronological_idx');
            $table->index(['session_id', 'start_time'], 'session_chronological_idx');
            $table->index(['status', 'type'], 'status_type_idx');
            $table->index(['trace_id', 'start_time'], 'trace_chronological_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_trace_spans');
    }
};
