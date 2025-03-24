<?php

namespace App\Http\Controllers\User;

use App\Models\Tag;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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

    public function getSnippetsByTag($tagName)
    {
        // Find the tag
        $tag = Tag::where('name', $tagName)->first();
        
        if (!$tag) {
            return response()->json([
                'success' => false,
                'message' => 'Tag not found'
            ], 404);
        }
        
        // get snippets with this tag for active user
        $snippets = $tag->snippets()->where('user_id', Auth::id())->get();
        
        return response()->json([
            'success' => true,
            'tag' => $tag,
            'snippets' => $snippets
        ]);
    }

}
