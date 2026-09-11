<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\QuizAttempt;
use App\Models\StudentTopicProgress;
use App\Models\Topic;
use App\Services\LearningProgressService;
use App\Services\RecommendationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected LearningProgressService $progressService;
    protected RecommendationService $recommendationService;

    public function __construct(
        LearningProgressService $progressService,
        RecommendationService $recommendationService
    ) {
        $this->progressService = $progressService;
        $this->recommendationService = $recommendationService;
    }

    public function index(Request $request): JsonResponse
    {
        $studentKey = $request->query('student_key', $request->header('X-Student-Key', 'demo-student'));

        $totalMaterials = Material::where('student_key', $studentKey)->count();
        $recentMaterials = Material::where('student_key', $studentKey)
            ->withCount(['chunks', 'topics'])
            ->orderBy('id', 'desc')
            ->limit(3)
            ->get();

        $studentMaterialIds = Material::where('student_key', $studentKey)->pluck('id');
        $totalTopics = Topic::whereIn('material_id', $studentMaterialIds)->count();

        $overallMastery = $this->progressService->getOverallMastery($studentKey);
        $topicProgress = $this->progressService->getStudentProgress($studentKey);

        $attempts = QuizAttempt::where('student_key', $studentKey)
            ->with('quiz')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        $latestAttempt = $attempts->first();
        $averageScore = $attempts->isNotEmpty() ? round($attempts->avg('score'), 1) : 0;

        $activeRecommendations = $this->recommendationService->getActiveRecommendations($studentKey);
        $primaryRecommendation = $activeRecommendations->first();

        return response()->json([
            'success' => true,
            'data' => [
                'student_key' => $studentKey,
                'stats' => [
                    'total_materials' => $totalMaterials,
                    'total_topics' => $totalTopics,
                    'overall_mastery' => $overallMastery,
                    'latest_score' => $latestAttempt ? $latestAttempt->score : null,
                    'average_score' => $averageScore,
                    'total_quiz_attempts' => $attempts->count(),
                ],
                'recent_materials' => $recentMaterials,
                'topic_progress' => $topicProgress->map(fn($p) => [
                    'topic_id' => $p->topic_id,
                    'name' => $p->topic->name ?? '',
                    'mastery' => round($p->mastery),
                ]),
                'recent_quizzes' => $attempts->map(fn($a) => [
                    'id' => $a->id,
                    'quiz_id' => $a->quiz_id,
                    'title' => $a->quiz->title ?? 'Kuis PBO',
                    'score' => $a->score,
                    'correct_answers' => $a->correct_answers,
                    'total_questions' => $a->total_questions,
                    'completed_at' => $a->completed_at?->toISOString(),
                ]),
                'recommendation' => $primaryRecommendation ? [
                    'id' => $primaryRecommendation->id,
                    'topic_id' => $primaryRecommendation->topic_id,
                    'topic_name' => $primaryRecommendation->topic->name ?? 'Topik Belajar',
                    'reason' => $primaryRecommendation->reason,
                    'priority' => $primaryRecommendation->priority,
                ] : null,
            ],
        ]);
    }
}
