<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentTopicProgress;
use App\Models\Topic;
use App\Services\LearningProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    protected LearningProgressService $progressService;

    public function __construct(LearningProgressService $progressService)
    {
        $this->progressService = $progressService;
    }

    public function index(Request $request): JsonResponse
    {
        $studentKey = $request->query('student_key', $request->header('X-Student-Key', 'demo-student'));

        $progressList = $this->progressService->getStudentProgress($studentKey);
        $overallMastery = $this->progressService->getOverallMastery($studentKey);

        $topicsCount = $progressList->count();
        $masteredCount = $progressList->where('mastery', '>=', 75)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'student_key' => $studentKey,
                'overall_mastery' => $overallMastery,
                'topics_count' => $topicsCount,
                'mastered_topics_count' => $masteredCount,
                'topics' => $progressList->map(function ($p) {
                    $status = 'Belum Dipelajari';
                    if ($p->mastery >= 75) {
                        $status = 'Dikuasai';
                    } elseif ($p->mastery >= 50) {
                        $status = 'Cukup';
                    } elseif ($p->mastery > 0) {
                        $status = 'Perlu Latihan';
                    }

                    return [
                        'id' => $p->id,
                        'topic_id' => $p->topic_id,
                        'name' => $p->topic->name ?? 'Topik',
                        'description' => $p->topic->description ?? '',
                        'mastery' => round($p->mastery),
                        'status' => $status,
                        'attempt_count' => $p->attempt_count,
                        'correct_count' => $p->correct_count,
                        'last_attempt_at' => $p->last_attempt_at?->toISOString(),
                    ];
                }),
            ],
        ]);
    }

    public function showTopic(int $topic, Request $request): JsonResponse
    {
        $studentKey = $request->query('student_key', $request->header('X-Student-Key', 'demo-student'));

        $progress = StudentTopicProgress::with('topic')
            ->where('student_key', $studentKey)
            ->where('topic_id', $topic)
            ->first();

        if (!$progress) {
            $topicModel = Topic::findOrFail($topic);
            return response()->json([
                'success' => true,
                'data' => [
                    'topic_id' => $topicModel->id,
                    'name' => $topicModel->name,
                    'mastery' => 0,
                    'status' => 'Belum Dipelajari',
                    'attempt_count' => 0,
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $progress,
        ]);
    }
}
