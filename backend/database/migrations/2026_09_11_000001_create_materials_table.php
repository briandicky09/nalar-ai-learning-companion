<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('student_key', 100)->index();
            $table->string('title');
            $table->string('original_filename');
            $table->string('file_path', 500);
            $table->string('file_type', 50)->default('pdf');
            $table->unsignedBigInteger('file_size');
            $table->enum('processing_status', ['pending', 'processing', 'completed', 'failed'])->default('pending')->index();
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
