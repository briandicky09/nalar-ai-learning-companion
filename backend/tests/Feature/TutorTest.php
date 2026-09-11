<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\MaterialChunk;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TutorTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_ask_tutor_and_receive_grounded_answer(): void
    {
        $material = Material::create([
            'student_key' => 'demo-student',
            'title' => 'Dasar PBO',
            'original_filename' => 'pbo.pdf',
            'file_path' => 'materials/pbo.pdf',
            'file_size' => 1024,
            'processing_status' => 'completed',
        ]);

        MaterialChunk::create([
            'material_id' => $material->id,
            'chunk_index' => 1,
            'page_number' => 3,
            'content' => 'Polymorphism adalah kemampuan suatu method menghasilkan perilaku berbeda sesuai jenis objek saat runtime.',
        ]);

        $response = $this->postJson('/api/tutor/ask', [
            'student_key' => 'demo-student',
            'material_id' => $material->id,
            'question' => 'Apa itu polymorphism dan bagaimana contohnya?',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data' => [
                    'answer',
                    'sources',
                ],
            ]);

        $data = $response->json('data');
        $this->assertNotEmpty($data['answer']);
        $this->assertNotEmpty($data['sources']);
    }
}
