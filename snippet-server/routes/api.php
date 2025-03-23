<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



// Unauthenticated Routes
Route::group(["prefix" => "v0.1"], function(){

    // Authenticated Routes
    Route::group(["middleware" => "auth:api"], function(){
        
        // User Routes
        Route::group(["prefix" => "user"], function(){
            
            });
        });

        // Common Routes
        Route::post('/edit_profile', [AuthController::class, "editProfile"]);
        Route::post('/logout', [AuthController::class, "logout"]);
    });

    // Unauthenticated Routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);
    });
