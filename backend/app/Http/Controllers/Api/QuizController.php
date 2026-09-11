<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateQuizRequest;
use App\Http\Requests\SubmitQuizRequest;
use App\Services\QuizService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    protected QuizService $quizService;

    public function __construct(QuizService $quizService)
    {
        $this->quizService = $quizService;
    }

    public function generate(GenerateQuizRequest $request): JsonResponse
    {
        $studentKey = $request->input('student_key');
        $materialId = $request->input('material_id');
        $topicId = $request->input('topic_id');
        $numberOfQuestions = $request->input('number_of_questions', 10);

        $quiz = $this->quizService->generateQuiz($studentKey, $materialId, $topicId, $numberOfQuestions);

        return response()->json([
            'success' => true,
            'message' => 'Kuis diagnostik berhasil dibuat.',
            'data' => $quiz,
        ], 201);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $includeAnswers = filter_var($request->query('include_answers', false), FILTER_VALIDATE_BOOLEAN);
        $quiz = $this->quizService->getQuiz($id, $includeAnswers);

        if (!$quiz) {
            return response()->json([
                'success' => false,
                'message' => 'Kuis tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $quiz,
        ]);
    }

    public function submit(int $id, SubmitQuizRequest $request): JsonResponse
    {
        $studentKey = $request->input('student_key');
        $answers = $request->input('answers');

        $result = $this->quizService->submitQuiz($id, $studentKey, $answers);

        return response()->json([
            'success' => true,
            'message' => 'Kuis berhasil dinilai oleh backend.',
            'data' => $result,
        ]);
    }

    public function attempts(int $id, Request $request): JsonResponse
    {
        $studentKey = $request->query('student_key', $request->header('X-Student-Key', 'demo-student'));
        $attempts = $this->quizService->getAttempts($id, $studentKey);

        return response()->json([
            'success' => true,
            'data' => $attempts,
        ]);
    }
}
