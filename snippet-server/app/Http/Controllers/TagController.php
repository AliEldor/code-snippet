<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    public function getTags()
    {
        $tags = Tag::whereHas('snippets', function($query) {
            $query->where('user_id', Auth::id());
        })->get();
        
        return response()->json([
            'success' => true,
            'tags' => $tags
        ]);
    }
}
