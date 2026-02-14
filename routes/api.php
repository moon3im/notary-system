<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

Route::prefix('v1')->group(function () {
    // مسارات المصادقة (لا تحتاج توكن)
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // مسارات تحتاج مصادقة
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
    });
});