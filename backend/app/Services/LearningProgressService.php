<?php

namespace App\Services;

use App\Models\StudentTopicProgress;
use App\Models\Topic;
use Illuminate\Support\Collection;

class LearningProgressService
{
    /**
     * Update student mastery for a topic following the Nalar formula:
     * new_mastery = previous_mastery ? (previous_mastery * 0.6) + (current_performance * 0.4) : current_performance
     */
    public function updateTopicMastery(string $studentKey, int $topicId, int $correctCount, int $totalCount): StudentTopicProgress
    {
        $currentPerformance = $totalCount > 0 ? ($correctCount / $totalCount) * 100 : 0;

        $progress = StudentTopicProgress::firstOrNew([
            'student_key' => $studentKey,
            'topic_id' => $topicId,
        ]);

        if ($progress->exists && $progress->attempt_count > 0) {
            $newMastery = ($progress->mastery * 0.6) + ($currentPerformance * 0.4);
        } else {
            $newMastery = $currentPerformance;
        }

        // Clamp to 0 - 100
        $newMastery = max(0.0, min(100.0, round($newMastery, 2)));

        $progress->mastery = $newMastery;
        $progress->attempt_count = ($progress->attempt_count ?? 0) + 1;
        $progress->correct_count = ($progress->correct_count ?? 0) + $correctCount;
        $progress->last_attempt_at = now();
        $progress->save();

        return $progress;
    }

    public function getStudentProgress(string $studentKey): Collection
    {
        return StudentTopicProgress::with('topic')
            ->where('student_key', $studentKey)
            ->get();
    }

    public function getOverallMastery(string $studentKey): float
    {
        $progress = StudentTopicProgress::where('student_key', $studentKey)->get();

        if ($progress->isEmpty()) {
            return 0.0;
        }

        return round($progress->avg('mastery'), 1);
    }
}
