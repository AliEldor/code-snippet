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


    public function addOrUpdateSnippet(Request $request, $id = "add"){
        if($id=="add"){
            $snippet = new Snippet();
            $snippet->user_id = Auth::id();
            $operation = "created";
        }
        else{
            $snippet = Snippet::find($id);

            // check if snippet exists for a user
            if (!$snippet || $snippet->user_id != Auth::id()) {
                return response()->json([
                    "success" => false,
                    "message" => "Unable to find snippet",
                    "snippet" => null
                ], 404);
            }
            $operation = "updated";
        }

        $snippet->title = $request["title"];
        $snippet->code = $request["code"];
        $snippet->language = $request["language"];
        $snippet->is_favorite = $request["is_favorite"] ?? false;
        $snippet->save();

        if ($request->has('tags') && !empty($request->tags)) {
            // comma between tags
            $tagsList = array_filter(array_map('trim', explode(',', $request->tags)));
            
            
            $tagIds = [];
            foreach ($tagsList as $tag) {
                $tagRecord = Tag::firstOrCreate(['name' => $tag]);
                $tagIds[] = $tagRecord->id;
            }
            
            // Sync tags with snippet
            $snippet->tags()->sync($tagIds);
        }

        $snippet = Snippet::with('tags')->find($snippet->id);
    
    
    return response()->json([
        "success" => true,
        "message" => "Snippet {$operation} successfully",
        "snippet" => $snippet
    ]);

    }
}
