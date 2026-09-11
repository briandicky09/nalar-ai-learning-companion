<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('student_key', 100)->index();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->text('reason');
            $table->enum('priority', ['high', 'medium', 'low'])->default('high');
            $table->enum('status', ['active', 'completed', 'dismissed'])->default('active');
            $table->timestamps();

            $table->index(['student_key', 'status', 'priority']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_recommendations');
    }
};
