<?php
// routes/web.php

use Illuminate\Support\Facades\Route;

// كل الطلبات تذهب إلى React (باستثناء مسارات API)
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api|admin|sanctum).*$');

