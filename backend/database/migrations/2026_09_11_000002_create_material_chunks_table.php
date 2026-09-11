<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained('materials')->cascadeOnDelete();
            $table->integer('chunk_index');
            $table->longText('content');
            $table->integer('page_number')->nullable();
            $table->timestamps();

            $table->index(['material_id', 'chunk_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_chunks');
    }
};
