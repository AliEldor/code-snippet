<?php

namespace App\Http\Controllers;

use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SnippetController extends Controller
{
    public function getSnippets()
    {
        $snippets = Snippet::with('tags')->where('user_id', Auth::id())->get();
        
        return response()->json([
            "success" => true,
            "snippets" => $snippets,
        ]);
    }

    // get snippet by id

    public function getSnippetById($id)
    {
        $snippet = Snippet::with('tags')->find($id);
        
        if (!$snippet || $snippet->user_id !== Auth::id()) {
            return response()->json([
                "success" => false,
                "message" => "Snippet not found"
            ], 404);
        }
        
        return response()->json([
            "success" => true,
            "snippet" => $snippet,
        ]);
    }
    
}
