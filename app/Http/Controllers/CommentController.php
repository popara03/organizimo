<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    private function formatComment($comment)
    {
        return [
            'id' => $comment->id,
            'post_id' => $comment->post_id,
            'author' => [
                'id' => $comment->user->id,
                'name' => $comment->user->name,
                'image' => $comment->user->image,
            ],
            'content' => $comment->content,
            'created_at' => $comment->created_at->toISOString(),
            'parent_id' => $comment->parent_id,
            'replies' => $comment->children->map(fn($child) => $this->formatComment($child)),
        ];
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:comments,id',
            'post_id' => 'required|exists:posts,id',
        ]);

        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => Auth::id(),
            'post_id' => $request->post_id,
            'parent_id' => $request->parent_id ?? null,
        ]);

        $comment->load('user', 'children.user', 'children.children');

        return response()->json([
            'message' => 'Comment submitted successfully',
            'comment' => $this->formatComment($comment),
        ]);
    }
}
