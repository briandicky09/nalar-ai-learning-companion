<?php

namespace Tests\Feature;

use App\Models\Material;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\StudentTopicProgress;
use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_generate_quiz(): void
    {
        $material = Material::create([
            'student_key' => 'demo-student',
            'title' => 'PBO Dasar',
            'original_filename' => 'pbo.pdf',
            'file_path' => 'materials/pbo.pdf',
            'file_size' => 1024,
            'processing_status' => 'completed',
        ]);

        $topic = Topic::create([
            'material_id' => $material->id,
            'name' => 'Polymorphism',
            'order' => 1,
        ]);

        $response = $this->postJson('/api/quizzes/generate', [
            'student_key' => 'demo-student',
            'material_id' => $material->id,
            'topic_id' => $topic->id,
            'number_of_questions' => 5,
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonPath('data.material_id', $material->id)
            ->assertJsonPath('data.total_questions', 5);

        $this->assertDatabaseHas('quizzes', [
            'material_id' => $material->id,
            'total_questions' => 5,
        ]);

        $this->assertEquals(5, Question::count());
    }

    public function test_can_submit_quiz_and_calculate_score_server_side(): void
    {
        $material = Material::create([
            'student_key' => 'demo-student',
            'title' => 'PBO Dasar',
            'original_filename' => 'pbo.pdf',
            'file_path' => 'materials/pbo.pdf',
            'file_size' => 1024,
            'processing_status' => 'completed',
        ]);

        $topic1 = Topic::create(['material_id' => $material->id, 'name' => 'Encapsulation', 'order' => 1]);
        $topic2 = Topic::create(['material_id' => $material->id, 'name' => 'Polymorphism', 'order' => 2]);

        $quiz = Quiz::create([
            'material_id' => $material->id,
            'title' => 'Kuis Uji',
            'total_questions' => 2,
        ]);

        $q1 = Question::create([
            'quiz_id' => $quiz->id,
            'topic_id' => $topic1->id,
            'question' => 'Soal 1',
            'option_a' => 'A',
            'option_b' => 'B',
            'option_c' => 'C',
            'option_d' => 'D',
            'correct_answer' => 'B',
            'explanation' => 'Penjelasan 1',
        ]);

        $q2 = Question::create([
            'quiz_id' => $quiz->id,
            'topic_id' => $topic2->id,
            'question' => 'Soal 2',
            'option_a' => 'A',
            'option_b' => 'B',
            'option_c' => 'C',
            'option_d' => 'D',
            'correct_answer' => 'A',
            'explanation' => 'Penjelasan 2',
        ]);

        // Submit: answer Q1 correctly (B), Q2 incorrectly (C instead of A)
        $response = $this->postJson("/api/quizzes/{$quiz->id}/submit", [
            'student_key' => 'demo-student',
            'answers' => [
                ['question_id' => $q1->id, 'selected_answer' => 'B'],
                ['question_id' => $q2->id, 'selected_answer' => 'C'],
            ],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'quiz_id' => $quiz->id,
                    'score' => 50.0,
                    'total_questions' => 2,
                    'correct_answers' => 1,
                ],
            ]);

        // Verify quiz attempt in database
        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id,
            'student_key' => 'demo-student',
            'score' => 50.0,
            'correct_answers' => 1,
        ]);

        // Verify student topic progress updated: Topic 1 = 100%, Topic 2 = 0%
        $this->assertDatabaseHas('student_topic_progress', [
            'student_key' => 'demo-student',
            'topic_id' => $topic1->id,
            'mastery' => 100.0,
        ]);

        $this->assertDatabaseHas('student_topic_progress', [
            'student_key' => 'demo-student',
            'topic_id' => $topic2->id,
            'mastery' => 0.0,
        ]);

        // Verify learning recommendation created for the weak topic (Topic 2)
        $this->assertDatabaseHas('learning_recommendations', [
            'student_key' => 'demo-student',
            'topic_id' => $topic2->id,
            'status' => 'active',
        ]);
    }
}
