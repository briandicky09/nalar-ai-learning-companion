<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AskTutorRequest;
use App\Services\TutorService;
use Illuminate\Http\JsonResponse;

class TutorController extends Controller
{
    protected TutorService $tutorService;

    public function __construct(TutorService $tutorService)
    {
        $this->tutorService = $tutorService;
    }

    public function ask(AskTutorRequest $request): JsonResponse
    {
        $studentKey = $request->input('student_key');
        $materialId = $request->input('material_id');
        $question = $request->input('question');

        $result = $this->tutorService->ask($studentKey, $materialId, $question);

        return response()->json([
            'success' => true,
            'message' => 'Jawaban tutor berhasil dihasilkan.',
            'data' => $result,
        ]);
    }
}
