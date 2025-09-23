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
        Schema::table('agent_trace_spans', function (Blueprint $table) {
            $table->foreign(['parent_span_id'])->references(['span_id'])->on('agent_trace_spans')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agent_trace_spans', function (Blueprint $table) {
            $table->dropForeign('agent_trace_spans_parent_span_id_foreign');
        });
    }
};
