<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\TutorController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Nalar AI Learning Companion - API Routes
|--------------------------------------------------------------------------
*/

Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'status' => 'ok',
        'app' => 'Nalar API',
        'timestamp' => now()->toISOString(),
    ]);
});

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);

// Materials
Route::prefix('materials')->group(function () {
    Route::post('/', [MaterialController::class, 'store']);
    Route::get('/', [MaterialController::class, 'index']);
    Route::get('/{id}', [MaterialController::class, 'show']);
    Route::delete('/{id}', [MaterialController::class, 'destroy']);
    Route::post('/{id}/process', [MaterialController::class, 'process']);
    Route::get('/{id}/status', [MaterialController::class, 'status']);
    Route::get('/{id}/topics', [MaterialController::class, 'topics']);
});

// AI Tutor
Route::prefix('tutor')->group(function () {
    Route::post('/ask', [TutorController::class, 'ask']);
});

// Quiz
Route::prefix('quizzes')->group(function () {
    Route::post('/generate', [QuizController::class, 'generate']);
    Route::get('/{id}', [QuizController::class, 'show']);
    Route::post('/{id}/submit', [QuizController::class, 'submit']);
    Route::get('/{id}/attempts', [QuizController::class, 'attempts']);
});

// Knowledge Profile & Topic Progress
Route::prefix('progress')->group(function () {
    Route::get('/', [ProgressController::class, 'index']);
    Route::get('/{topic}', [ProgressController::class, 'showTopic']);
});

// Learning Recommendations
Route::get('/recommendations', [RecommendationController::class, 'index']);
