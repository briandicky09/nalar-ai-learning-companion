<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMaterialRequest;
use App\Models\Material;
use App\Services\DocumentProcessingService;
use App\Services\MaterialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    protected MaterialService $materialService;
    protected DocumentProcessingService $processingService;

    public function __construct(
        MaterialService $materialService,
        DocumentProcessingService $processingService
    ) {
        $this->materialService = $materialService;
        $this->processingService = $processingService;
    }

    public function index(Request $request): JsonResponse
    {
        $studentKey = $request->query('student_key', $request->header('X-Student-Key', 'demo-student'));
        $materials = $this->materialService->getMaterials($studentKey);

        return response()->json([
            'success' => true,
            'message' => 'Daftar materi berhasil diambil.',
            'data' => $materials,
        ]);
    }

    public function store(StoreMaterialRequest $request): JsonResponse
    {
        $material = $this->materialService->storeMaterial(
            $request->input('student_key'),
            $request->input('title'),
            $request->file('file')
        );

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil diunggah. Siap untuk diproses.',
            'data' => $material,
        ], 201);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $studentKey = $request->query('student_key', $request->header('X-Student-Key'));
        $material = $this->materialService->getMaterial($id, $studentKey);

        if (!$material) {
            return response()->json([
                'success' => false,
                'message' => 'Materi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $material,
        ]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $studentKey = $request->input('student_key', $request->query('student_key', $request->header('X-Student-Key', 'demo-student')));
        $deleted = $this->materialService->deleteMaterial($id, $studentKey);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Materi tidak ditemukan atau gagal dihapus.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil dihapus.',
        ]);
    }

    public function process(int $id, Request $request): JsonResponse
    {
        $material = Material::findOrFail($id);

        $success = $this->processingService->process($material);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses materi PDF: ' . ($material->error_message ?? 'Terjadi kesalahan sistem'),
                'data' => $material->fresh(['topics', 'chunks']),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Materi berhasil diproses dan topik telah diekstraksi.',
            'data' => $material->fresh(['topics', 'chunks']),
        ]);
    }

    public function status(int $id): JsonResponse
    {
        $material = Material::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $material->id,
                'status' => $material->processing_status,
                'chunks_count' => $material->chunks()->count(),
                'topics_count' => $material->topics()->count(),
                'error_message' => $material->error_message,
            ],
        ]);
    }

    public function topics(int $id): JsonResponse
    {
        $material = Material::with('topics')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $material->topics,
        ]);
    }
}
