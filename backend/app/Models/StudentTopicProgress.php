<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentTopicProgress extends Model
{
    use HasFactory;

    protected $table = 'student_topic_progress';

    protected $fillable = [
        'student_key',
        'topic_id',
        'mastery',
        'attempt_count',
        'correct_count',
        'last_attempt_at',
    ];

    protected $casts = [
        'mastery' => 'float',
        'last_attempt_at' => 'datetime',
    ];

    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }
}
