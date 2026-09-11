<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MaterialTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_upload_pdf_material(): void
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('sample.pdf', 1024, 'application/pdf');

        $response = $this->postJson('/api/materials', [
            'student_key' => 'demo-student',
            'title' => 'Struktur Data Dasar',
            'file' => $file,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'student_key' => 'demo-student',
                    'title' => 'Struktur Data Dasar',
                    'processing_status' => 'pending',
                ],
            ]);

        $this->assertDatabaseHas('materials', [
            'student_key' => 'demo-student',
            'title' => 'Struktur Data Dasar',
        ]);
    }

    public function test_cannot_upload_invalid_file_type(): void
    {
        Storage::fake('local');

        $file = UploadedFile::fake()->create('image.png', 500, 'image/png');

        $response = $this->postJson('/api/materials', [
            'student_key' => 'demo-student',
            'title' => 'Invalid Material',
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_can_list_materials_for_student(): void
    {
        Material::create([
            'student_key' => 'demo-student',
            'title' => 'Materi 1',
            'original_filename' => 'materi1.pdf',
            'file_path' => 'materials/materi1.pdf',
            'file_size' => 1024,
            'processing_status' => 'completed',
        ]);

        Material::create([
            'student_key' => 'other-student',
            'title' => 'Materi Orang Lain',
            'original_filename' => 'other.pdf',
            'file_path' => 'materials/other.pdf',
            'file_size' => 1024,
            'processing_status' => 'completed',
        ]);

        $response = $this->getJson('/api/materials?student_key=demo-student');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(1, 'data');
    }

    public function test_can_process_material_and_extract_topics(): void
    {
        Storage::fake('local');

        // Create a minimal valid PDF content
        $pdfContent = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF";
        $filePath = 'materials/test_doc.pdf';
        Storage::disk('local')->put($filePath, $pdfContent);

        $material = Material::create([
            'student_key' => 'demo-student',
            'title' => 'PBO Komprehensif',
            'original_filename' => 'test_doc.pdf',
            'file_path' => $filePath,
            'file_size' => strlen($pdfContent),
            'processing_status' => 'pending',
        ]);

        $response = $this->postJson("/api/materials/{$material->id}/process");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'processing_status' => 'completed',
                ],
            ]);

        $this->assertDatabaseHas('materials', [
            'id' => $material->id,
            'processing_status' => 'completed',
        ]);

        $this->assertDatabaseHas('topics', [
            'material_id' => $material->id,
            'name' => 'Encapsulation',
        ]);

        $this->assertDatabaseHas('material_chunks', [
            'material_id' => $material->id,
        ]);
    }
}
