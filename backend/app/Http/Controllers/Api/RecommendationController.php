<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecommendationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    protected RecommendationService $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    public function index(Request $request): JsonResponse
    {
        $studentKey = $request->query('student_key', $request->header('X-Student-Key', 'demo-student'));

        $recommendations = $this->recommendationService->getActiveRecommendations($studentKey);

        // If no active recommendations, try to generate one from existing progress
        if ($recommendations->isEmpty()) {
            $generated = $this->recommendationService->generateForStudent($studentKey);
            if ($generated) {
                $recommendations = collect([$generated->load('topic')]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $recommendations->map(function ($rec) {
                return [
                    'id' => $rec->id,
                    'topic_id' => $rec->topic_id,
                    'topic_name' => $rec->topic->name ?? 'Topik Terkait',
                    'reason' => $rec->reason,
                    'priority' => $rec->priority,
                    'status' => $rec->status,
                    'created_at' => $rec->created_at->toISOString(),
                ];
            }),
        ]);
    }
}
