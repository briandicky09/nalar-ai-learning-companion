<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Nalar — AI Learning Companion Backend',
        'status' => 'online',
        'version' => '1.0.0',
    ]);
});
