<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_key',
        'title',
        'original_filename',
        'file_path',
        'file_type',
        'file_size',
        'processing_status',
        'error_message',
    ];

    public function chunks(): HasMany
    {
        return $this->hasMany(MaterialChunk::class)->orderBy('chunk_index');
    }

    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class)->orderBy('order');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }
}
