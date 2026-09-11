<?php

namespace App\Services\Contracts;

use App\Models\Material;
use App\Models\Topic;
use App\Models\QuizAttempt;
use Illuminate\Support\Collection;

interface AIServiceInterface
{
    /**
     * Analyze extracted material chunks to identify key topics and concepts.
     *
     * @param Material $material
     * @param array $chunks
     * @return array Array of topics: [['name' => '...', 'description' => '...', 'order' => 1]]
     */
    public function analyzeMaterial(Material $material, array $chunks): array;

    /**
     * Answer student question grounded on material chunks.
     *
     * @param string $question
     * @param Material|null $material
     * @param array $contextChunks
     * @return array ['answer' => string, 'sources' => array]
     */
    public function answerTutorQuestion(string $question, ?Material $material, array $contextChunks): array;

    /**
     * Generate diagnostic quiz questions for material and optional topic.
     *
     * @param Material $material
     * @param Topic|null $topic
     * @param int $numberOfQuestions
     * @return array Array of questions: [['question' => '...', 'option_a' => '...', ..., 'correct_answer' => 'A', 'explanation' => '...']]
     */
    public function generateQuiz(Material $material, ?Topic $topic, int $numberOfQuestions): array;

    /**
     * Analyze quiz results to identify concept weaknesses and strengths.
     *
     * @param QuizAttempt $attempt
     * @return array ['strengths' => array, 'weaknesses' => array, 'analysis' => string]
     */
    public function analyzeQuizResult(QuizAttempt $attempt): array;

    /**
     * Generate personalized learning recommendation based on knowledge profile.
     *
     * @param string $studentKey
     * @param Collection $topicProgresses
     * @return array ['topic_id' => int|null, 'reason' => string, 'priority' => string]
     */
    public function generateLearningRecommendation(string $studentKey, Collection $topicProgresses): array;
}
