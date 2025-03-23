<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/', function () {
    return view('welcome');
});
// In routes/web.php for testing
Route::get('/test-signup', [AuthController::class, 'signup']);
