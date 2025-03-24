<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\SnippetController;
use App\Http\Controllers\User\TagController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');



// API Routes with versioning
Route::group(["prefix" => "v0.1"], function(){

    // Authenticated Routes
    Route::group(["middleware" => "auth:api"], function(){
        
        // User Routes
        Route::group(["prefix" => "user"], function(){
          
            // snippet routes
            Route::get('/snippets', [SnippetController::class, 'getSnippets']);
            Route::get('/snippets/search', [SnippetController::class, 'search']);
            Route::get('/snippets/{id}', [SnippetController::class, 'getSnippetById']);
            Route::post('/snippets/{id?}', [SnippetController::class, 'addOrUpdateSnippet']);
            Route::delete('/snippets/{id}', [SnippetController::class, 'deleteSnippet']);

            // Favorite route
            Route::post('/snippets/{id}/favorite', [SnippetController::class, 'updateFavoriteStatus']);

            //tag routes
            Route::get('/tags', [TagController::class, 'getTags']);
            Route::get('/tags/{tagName}/snippets', [TagController::class, 'getSnippetsByTag']);
            
           
            });
        

        // Common Routes
        Route::post('/logout', [AuthController::class, "logout"]);
    });

    // Unauthenticated Routes
    Route::group(["prefix" => "guest"], function(){
        Route::post('/login', [AuthController::class, "login"]);
        Route::post('/signup', [AuthController::class, "signup"]);
    });
});
