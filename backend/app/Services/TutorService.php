<?php

namespace App\Services;

use App\Models\Material;
use App\Models\MaterialChunk;
use App\Services\Contracts\AIServiceInterface;

class TutorService
{
    protected AIServiceInterface $aiService;

    public function __construct(AIServiceInterface $aiService)
    {
        $this->aiService = $aiService;
    }

    public function ask(string $studentKey, ?int $materialId, string $question): array
    {
        $material = null;
        $contextChunks = [];

        if ($materialId) {
            $material = Material::where('id', $materialId)
                ->where('student_key', $studentKey)
                ->first();

            if ($material) {
                // Search chunks by keyword or get first few chunks
                $keywords = array_filter(explode(' ', strtolower($question)), fn($w) => strlen($w) > 3);

                $chunkQuery = MaterialChunk::where('material_id', $material->id);

                if (!empty($keywords)) {
                    $chunkQuery->where(function ($q) use ($keywords) {
                        foreach ($keywords as $kw) {
                            $q->orWhere('content', 'LIKE', "%{$kw}%");
                        }
                    });
                }

                $contextChunks = $chunkQuery->limit(3)->get()->map(function ($chunk) {
                    return [
                        'material_id' => $chunk->material_id,
                        'chunk_index' => $chunk->chunk_index,
                        'content' => $chunk->content,
                        'page_number' => $chunk->page_number,
                    ];
                })->toArray();

                // If keyword query yielded empty, fallback to first 2 chunks of material
                if (empty($contextChunks)) {
                    $contextChunks = MaterialChunk::where('material_id', $material->id)
                        ->orderBy('chunk_index')
                        ->limit(2)
                        ->get()
                        ->map(fn($c) => [
                            'material_id' => $c->material_id,
                            'chunk_index' => $c->chunk_index,
                            'content' => $c->content,
                            'page_number' => $c->page_number,
                        ])
                        ->toArray();
                }
            }
        }

        return $this->aiService->answerTutorQuestion($question, $material, $contextChunks);
    }
}
