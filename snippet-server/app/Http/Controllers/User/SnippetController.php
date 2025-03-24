<?php

namespace App\Http\Controllers\User;
use App\Http\Controllers\Controller;
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

        // tags
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

    public function deleteSnippet($id)
    {
        $snippet = Snippet::find($id);
        
        if (!$snippet || $snippet->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Snippet not found'
            ], 404);
        }
        
        $snippet->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Snippet deleted successfully'
        ]);
    }

    public function search(Request $request){

        $search = $request->search;
        $snippets = Snippet::where('user_id', Auth::id());
        
        if (!empty($search)) {
            $snippets->where(function($query) use ($search) {
                $query->where('title', 'LIKE', "%{$search}%")
                      ->orWhere('code', 'LIKE', "%{$search}%")
                      ->orWhere('language', 'LIKE', "%{$search}%");
            });
        }

            // language filter
            if ($request->has('language') && !empty($request->language)) {
                $snippets->where('language', $request->language);
            }

            $results = $snippets->with('tags')->get();
        
        return response()->json([
            'success' => true,
            'snippets' => $results
        ]);
    
    }

    public function updateFavoriteStatus(Request $request, $id){
    
    $snippet = Snippet::find($id);
    
    // Check if snippet exists
    if (!$snippet || $snippet->user_id != Auth::id()) {
        return response()->json([
            "success" => false,
            "message" => "Unable to find snippet",
            "snippet" => null
        ], 404);
    }
    
    //validte
    $request->validate([
        'is_favorite' => 'required|boolean'
    ]);
    
    // Update   status directly from  frontend 
    $snippet->is_favorite = $request->is_favorite;
    $snippet->save();
    
    return response()->json([
        "success" => true,
        "message" => $snippet->is_favorite ? "Added to favorites" : "Removed from favorites",
        "snippet" => $snippet
    ]);
}

}
