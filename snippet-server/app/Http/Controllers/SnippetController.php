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
}
