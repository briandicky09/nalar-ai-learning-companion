<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_topic_progress', function (Blueprint $table) {
            $table->id();
            $table->string('student_key', 100)->index();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->decimal('mastery', 5, 2)->default(0.00);
            $table->integer('attempt_count')->default(0);
            $table->integer('correct_count')->default(0);
            $table->timestamp('last_attempt_at')->nullable();
            $table->timestamps();

            $table->unique(['student_key', 'topic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_topic_progress');
    }
};
