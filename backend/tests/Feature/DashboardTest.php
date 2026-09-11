<?php

namespace Tests\Feature;

use App\Models\LearningRecommendation;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\StudentTopicProgress;
use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_retrieve_dashboard_data(): void
    {
        $material = Material::create([
            'student_key' => 'demo-student',
            'title' => 'Materi Kuliah PBO',
            'original_filename' => 'pbo.pdf',
            'file_path' => 'materials/pbo.pdf',
            'file_size' => 1024,
            'processing_status' => 'completed',
        ]);

        $topic = Topic::create([
            'material_id' => $material->id,
            'name' => 'Inheritance',
            'order' => 1,
        ]);

        StudentTopicProgress::create([
            'student_key' => 'demo-student',
            'topic_id' => $topic->id,
            'mastery' => 85.0,
            'attempt_count' => 2,
            'correct_count' => 8,
        ]);

        $quiz = Quiz::create([
            'material_id' => $material->id,
            'title' => 'Kuis Evaluasi',
            'total_questions' => 5,
        ]);

        QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_key' => 'demo-student',
            'score' => 80.0,
            'total_questions' => 5,
            'correct_answers' => 4,
            'completed_at' => now(),
        ]);

        LearningRecommendation::create([
            'student_key' => 'demo-student',
            'topic_id' => $topic->id,
            'reason' => 'Pertahankan penguasaan topik Inheritance.',
            'priority' => 'low',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/dashboard?student_key=demo-student');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'student_key' => 'demo-student',
                    'stats' => [
                        'total_materials' => 1,
                        'total_topics' => 1,
                        'overall_mastery' => 85.0,
                        'latest_score' => 80.0,
                    ],
                ],
            ])
            ->assertJsonPath('data.recommendation.topic_name', 'Inheritance');
    }
}
