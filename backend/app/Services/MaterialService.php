<?php

namespace App\Services;

use App\Models\Material;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class MaterialService
{
    public function storeMaterial(string $studentKey, string $title, UploadedFile $file): Material
    {
        $originalFilename = $file->getClientOriginalName();
        $fileSize = $file->getSize();
        $extension = $file->getClientOriginalExtension() ?: 'pdf';

        // Store file securely in local storage under materials/
        $filePath = $file->store('materials', 'local');

        return Material::create([
            'student_key' => $studentKey,
            'title' => $title,
            'original_filename' => $originalFilename,
            'file_path' => $filePath,
            'file_type' => strtolower($extension),
            'file_size' => $fileSize,
            'processing_status' => 'pending',
        ]);
    }

    public function getMaterials(string $studentKey): Collection
    {
        return Material::where('student_key', $studentKey)
            ->withCount(['chunks', 'topics', 'quizzes'])
            ->orderBy('id', 'desc')
            ->get();
    }

    public function getMaterial(int $id, ?string $studentKey = null): ?Material
    {
        $query = Material::with(['topics', 'chunks']);

        if ($studentKey) {
            $query->where('student_key', $studentKey);
        }

        return $query->find($id);
    }

    public function deleteMaterial(int $id, string $studentKey): bool
    {
        $material = Material::where('id', $id)
            ->where('student_key', $studentKey)
            ->first();

        if (!$material) {
            return false;
        }

        if (Storage::disk('local')->exists($material->file_path)) {
            Storage::disk('local')->delete($material->file_path);
        }

        return $material->delete();
    }
}
