<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Topic;
use App\Models\QuizAttempt;
use App\Services\Contracts\AIServiceInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * OpenClawService
 *
 * Adapter for communicating with the OpenClaw autonomous agent framework.
 *
 * TODO: Connect to actual OpenClaw endpoint provided by Hackfest environment.
 * Configuration:
 * - OPENCLAW_BASE_URL
 * - OPENCLAW_API_KEY
 * - OPENCLAW_AGENT_ID
 */
class OpenClawService implements AIServiceInterface
{
    protected ?string $baseUrl;
    protected ?string $apiKey;
    protected ?string $agentId;
    protected MockAIService $fallbackService;

    public function __construct(MockAIService $fallbackService)
    {
        $this->baseUrl = config('services.ai.openclaw.base_url');
        $this->apiKey = config('services.ai.openclaw.api_key');
        $this->agentId = config('services.ai.openclaw.agent_id');
        $this->fallbackService = $fallbackService;
    }

    public function analyzeMaterial(Material $material, array $chunks): array
    {
        // If OpenClaw configuration is not yet available, fallback gracefully
        if (empty($this->baseUrl)) {
            Log::info('OpenClaw endpoint not configured. Falling back to MockAIService for material analysis.');
            return $this->fallbackService->analyzeMaterial($material, $chunks);
        }

        try {
            // TODO: Connect to actual OpenClaw endpoint provided by Hackfest environment.
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post("{$this->baseUrl}/api/v1/agents/{$this->agentId}/analyze-material", [
                'material_id' => $material->id,
                'title' => $material->title,
                'chunks' => $chunks,
            ]);

            if ($response->successful() && isset($response->json()['topics'])) {
                return $response->json()['topics'];
            }
        } catch (\Throwable $e) {
            Log::warning('OpenClaw connection failed: ' . $e->getMessage() . '. Using fallback.');
        }

        return $this->fallbackService->analyzeMaterial($material, $chunks);
    }

    public function answerTutorQuestion(string $question, ?Material $material, array $contextChunks): array
    {
        if (empty($this->baseUrl)) {
            Log::info('OpenClaw endpoint not configured. Falling back to MockAIService for tutor.');
            return $this->fallbackService->answerTutorQuestion($question, $material, $contextChunks);
        }

        try {
            // TODO: Connect to actual OpenClaw endpoint provided by Hackfest environment.
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->timeout(15)->post("{$this->baseUrl}/api/v1/agents/{$this->agentId}/ask", [
                'question' => $question,
                'material_id' => $material?->id,
                'context' => $contextChunks,
            ]);

            if ($response->successful()) {
                return [
                    'answer' => $response->json('answer'),
                    'sources' => $response->json('sources', []),
                ];
            }
        } catch (\Throwable $e) {
            Log::warning('OpenClaw tutor call failed: ' . $e->getMessage() . '. Using fallback.');
        }

        return $this->fallbackService->answerTutorQuestion($question, $material, $contextChunks);
    }

    public function generateQuiz(Material $material, ?Topic $topic, int $numberOfQuestions): array
    {
        if (empty($this->baseUrl)) {
            return $this->fallbackService->generateQuiz($material, $topic, $numberOfQuestions);
        }

        try {
            // TODO: Connect to actual OpenClaw endpoint provided by Hackfest environment.
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->timeout(30)->post("{$this->baseUrl}/api/v1/agents/{$this->agentId}/generate-quiz", [
                'material_id' => $material->id,
                'topic_id' => $topic?->id,
                'count' => $numberOfQuestions,
            ]);

            if ($response->successful() && isset($response->json()['questions'])) {
                return $response->json()['questions'];
            }
        } catch (\Throwable $e) {
            Log::warning('OpenClaw quiz generation failed: ' . $e->getMessage() . '. Using fallback.');
        }

        return $this->fallbackService->generateQuiz($material, $topic, $numberOfQuestions);
    }

    public function analyzeQuizResult(QuizAttempt $attempt): array
    {
        if (empty($this->baseUrl)) {
            return $this->fallbackService->analyzeQuizResult($attempt);
        }

        try {
            // TODO: Connect to actual OpenClaw endpoint provided by Hackfest environment.
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->timeout(15)->post("{$this->baseUrl}/api/v1/agents/{$this->agentId}/analyze-result", [
                'attempt_id' => $attempt->id,
                'score' => $attempt->score,
            ]);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Throwable $e) {
            Log::warning('OpenClaw analyze result failed: ' . $e->getMessage() . '. Using fallback.');
        }

        return $this->fallbackService->analyzeQuizResult($attempt);
    }

    public function generateLearningRecommendation(string $studentKey, Collection $topicProgresses): array
    {
        if (empty($this->baseUrl)) {
            return $this->fallbackService->generateLearningRecommendation($studentKey, $topicProgresses);
        }

        try {
            // TODO: Connect to actual OpenClaw endpoint provided by Hackfest environment.
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->timeout(15)->post("{$this->baseUrl}/api/v1/agents/{$this->agentId}/recommendations", [
                'student_key' => $studentKey,
                'progress' => $topicProgresses->toArray(),
            ]);

            if ($response->successful()) {
                return $response->json();
            }
        } catch (\Throwable $e) {
            Log::warning('OpenClaw recommendation failed: ' . $e->getMessage() . '. Using fallback.');
        }

        return $this->fallbackService->generateLearningRecommendation($studentKey, $topicProgresses);
    }
}
