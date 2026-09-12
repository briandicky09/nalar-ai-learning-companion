<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any?}', function (?string $any = null) {
    if (empty($any)) {
        $rootFile = public_path('index.html');
        if (file_exists($rootFile)) {
            return response()->file($rootFile);
        }
        return response()->json([
            'app' => 'Nalar — AI Learning Companion Backend',
            'status' => 'online',
            'version' => '1.0.0',
        ]);
    }

    $dirIndex = public_path($any . '/index.html');
    if (file_exists($dirIndex)) {
        return response()->file($dirIndex);
    }

    $fileHtml = public_path($any . '.html');
    if (file_exists($fileHtml)) {
        return response()->file($fileHtml);
    }

    $fallback = public_path('index.html');
    if (file_exists($fallback)) {
        return response()->file($fallback);
    }

    abort(404);
})->where('any', '^(?!api).*$');
