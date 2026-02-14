<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClientController;    // ✅ أضف هذا
use App\Http\Controllers\Api\V1\TemplateController;  
Route::prefix('v1')->group(function () {
    // مسارات المصادقة (لا تحتاج توكن)
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // مسارات تحتاج مصادقة
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
    });
    Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
        Route::apiResource('clients', ClientController::class);
        
        Route::apiResource('templates', TemplateController::class);
        
        Route::apiResource('contracts', ContractController::class);
        Route::post('contracts/{contract}/generate-pdf', [ContractController::class, 'generatePdf']);
        Route::post('contracts/{contract}/void', [ContractController::class, 'void']);
    });
});