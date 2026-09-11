<?php

namespace App\Services;

use App\Models\LearningRecommendation;
use App\Models\StudentTopicProgress;
use App\Services\Contracts\AIServiceInterface;
use Illuminate\Support\Collection;

class RecommendationService
{
    protected AIServiceInterface $aiService;

    public function __construct(AIServiceInterface $aiService)
    {
        $this->aiService = $aiService;
    }

    public function generateForStudent(string $studentKey): ?LearningRecommendation
    {
        $progresses = StudentTopicProgress::with('topic')
            ->where('student_key', $studentKey)
            ->get();

        if ($progresses->isEmpty()) {
            return null;
        }

        $recData = $this->aiService->generateLearningRecommendation($studentKey, $progresses);

        if (empty($recData['topic_id'])) {
            return null;
        }

        // Archive or dismiss previous active recommendations for the same topic
        LearningRecommendation::where('student_key', $studentKey)
            ->where('topic_id', $recData['topic_id'])
            ->where('status', 'active')
            ->update(['status' => 'dismissed']);

        // Create new active recommendation
        return LearningRecommendation::create([
            'student_key' => $studentKey,
            'topic_id' => $recData['topic_id'],
            'reason' => $recData['reason'],
            'priority' => $recData['priority'] ?? 'high',
            'status' => 'active',
        ]);
    }

    public function getActiveRecommendations(string $studentKey): Collection
    {
        return LearningRecommendation::with('topic')
            ->where('student_key', $studentKey)
            ->where('status', 'active')
            ->orderByRaw("CASE WHEN priority = 'high' THEN 1 WHEN priority = 'medium' THEN 2 ELSE 3 END")
            ->orderBy('id', 'desc')
            ->get();
    }
}
