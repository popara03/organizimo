<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public static function formatComment($comment){
        return [
            'id' => $comment->id,
            'post_id' => $comment->post_id,
            'author' => [
                'id' => $comment->user->id,
                'name' => $comment->user->name,
                'image' => $comment->user->image,
            ],
            'content' => $comment->content,
            'created_at' => $comment->created_at->toDateTimeString(),
            'parent_id' => $comment->parent_id,
            'replies' => $comment->childrenRecursive?->map(fn($child) => self::formatComment($child)),
        ];
    }

    public function store(Request $request)
    {
        try{
            $request->validate([
                'content' => 'required|string|min:2|max:255',
                'parent_id' => 'nullable|exists:comments,id',
                'post_id' => 'required|exists:posts,id',
            ]);

            $post = Post::find($request->post_id);
            if (!$post) {
                return response()->json(['error' => 'Post not found'], 404);
            }
            elseif (!$post->status) {
                return response()->json(['error' => 'Cannot comment on an "discussion closed" post.'], 403);
            }

            $comment = Comment::create([
                'content' => $request->content,
                'user_id' => Auth::id(),
                'post_id' => $request->post_id,
                'parent_id' => $request->parent_id ?? null,
            ]);

            $comment->load('user');

            return response()->json([
                'message' => 'Comment submitted successfully',
                'comment' => $this->formatComment($comment),
            ]);
        }
        catch(Exception $e){
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
