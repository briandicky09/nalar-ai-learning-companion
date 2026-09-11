<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\Material;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Topic;
use App\Services\Contracts\AIServiceInterface;
use Illuminate\Support\Facades\DB;

class QuizService
{
    protected AIServiceInterface $aiService;
    protected LearningProgressService $progressService;
    protected RecommendationService $recommendationService;

    public function __construct(
        AIServiceInterface $aiService,
        LearningProgressService $progressService,
        RecommendationService $recommendationService
    ) {
        $this->aiService = $aiService;
        $this->progressService = $progressService;
        $this->recommendationService = $recommendationService;
    }

    public function generateQuiz(string $studentKey, int $materialId, ?int $topicId = null, int $numberOfQuestions = 10): Quiz
    {
        $material = Material::findOrFail($materialId);
        $topic = $topicId ? Topic::find($topicId) : null;

        $questionData = $this->aiService->generateQuiz($material, $topic, $numberOfQuestions);

        return DB::transaction(function () use ($material, $topic, $questionData) {
            $quizTitle = $topic
                ? "Kuis Diagnostik: {$topic->name}"
                : "Kuis Komprehensif: {$material->title}";

            $quiz = Quiz::create([
                'material_id' => $material->id,
                'topic_id' => $topic?->id,
                'title' => $quizTitle,
                'total_questions' => count($questionData),
            ]);

            // Map topic names to IDs for this material
            $materialTopics = Topic::where('material_id', $material->id)->get()->keyBy(fn($t) => strtolower($t->name));

            foreach ($questionData as $qItem) {
                $itemTopicName = strtolower($qItem['topic'] ?? '');
                $matchedTopicId = $topic?->id ?? ($materialTopics[$itemTopicName]->id ?? null);

                Question::create([
                    'quiz_id' => $quiz->id,
                    'topic_id' => $matchedTopicId,
                    'question' => $qItem['question'],
                    'option_a' => $qItem['option_a'],
                    'option_b' => $qItem['option_b'],
                    'option_c' => $qItem['option_c'],
                    'option_d' => $qItem['option_d'],
                    'correct_answer' => strtoupper($qItem['correct_answer']),
                    'explanation' => $qItem['explanation'] ?? null,
                ]);
            }

            return $quiz->load('questions');
        });
    }

    public function getQuiz(int $id, bool $includeAnswers = false): ?Quiz
    {
        $quiz = Quiz::with(['material', 'topic'])->find($id);

        if (!$quiz) {
            return null;
        }

        if ($includeAnswers) {
            $quiz->load('questions');
        } else {
            // Hide correct_answer and explanation for active quiz taker
            $quiz->load(['questions' => function ($q) {
                $q->select('id', 'quiz_id', 'topic_id', 'question', 'option_a', 'option_b', 'option_c', 'option_d');
            }]);
        }

        return $quiz;
    }

    public function submitQuiz(int $quizId, string $studentKey, array $submittedAnswers): array
    {
        $quiz = Quiz::with('questions.topic')->findOrFail($quizId);
        $questions = $quiz->questions->keyBy('id');

        $totalQuestions = $questions->count();
        $correctCount = 0;
        $evaluatedAnswers = [];
        $topicResults = []; // [topic_id => ['correct' => X, 'total' => Y]]

        foreach ($submittedAnswers as $sub) {
            $questionId = $sub['question_id'] ?? null;
            $selected = strtoupper(trim($sub['selected_answer'] ?? ''));

            if (!$questionId || !isset($questions[$questionId])) {
                continue;
            }

            $question = $questions[$questionId];
            $isCorrect = ($selected === $question->correct_answer);

            if ($isCorrect) {
                $correctCount++;
            }

            $evaluatedAnswers[] = [
                'question_id' => $questionId,
                'selected_answer' => $selected,
                'is_correct' => $isCorrect,
                'correct_answer' => $question->correct_answer,
                'explanation' => $question->explanation,
                'topic_name' => $question->topic->name ?? 'Dasar PBO',
            ];

            // Track per topic performance
            if ($question->topic_id) {
                if (!isset($topicResults[$question->topic_id])) {
                    $topicResults[$question->topic_id] = ['correct' => 0, 'total' => 0];
                }
                $topicResults[$question->topic_id]['total']++;
                if ($isCorrect) {
                    $topicResults[$question->topic_id]['correct']++;
                }
            }
        }

        // Calculate score on the backend
        $score = $totalQuestions > 0 ? round(($correctCount / $totalQuestions) * 100, 2) : 0.0;

        return DB::transaction(function () use (
            $quiz,
            $studentKey,
            $score,
            $totalQuestions,
            $correctCount,
            $evaluatedAnswers,
            $topicResults
        ) {
            // 1. Create Quiz Attempt
            $attempt = QuizAttempt::create([
                'quiz_id' => $quiz->id,
                'student_key' => $studentKey,
                'score' => $score,
                'total_questions' => $totalQuestions,
                'correct_answers' => $correctCount,
                'completed_at' => now(),
            ]);

            // 2. Save individual answers
            foreach ($evaluatedAnswers as $eva) {
                Answer::create([
                    'quiz_attempt_id' => $attempt->id,
                    'question_id' => $eva['question_id'],
                    'selected_answer' => $eva['selected_answer'],
                    'is_correct' => $eva['is_correct'],
                ]);
            }

            // 3. Update student topic mastery for all touched topics
            foreach ($topicResults as $topicId => $res) {
                $this->progressService->updateTopicMastery(
                    $studentKey,
                    $topicId,
                    $res['correct'],
                    $res['total']
                );
            }

            // 4. Analyze quiz diagnostic (strengths vs weaknesses)
            $diagnostic = $this->aiService->analyzeQuizResult($attempt);

            // 5. Generate updated learning recommendation
            $recommendation = $this->recommendationService->generateForStudent($studentKey);

            return [
                'attempt_id' => $attempt->id,
                'quiz_id' => $quiz->id,
                'score' => $score,
                'total_questions' => $totalQuestions,
                'correct_answers' => $correctCount,
                'diagnostic' => $diagnostic,
                'recommendation' => $recommendation ? $recommendation->load('topic') : null,
                'answers' => $evaluatedAnswers,
            ];
        });
    }

    public function getAttempts(int $quizId, string $studentKey): array
    {
        return QuizAttempt::where('quiz_id', $quizId)
            ->where('student_key', $studentKey)
            ->with(['answers.question'])
            ->orderBy('id', 'desc')
            ->get()
            ->toArray();
    }
}
