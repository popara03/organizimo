<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use App\Models\Group;
use App\Models\Post;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $groups = Group::with('users')
        ->where('is_ffa', true)
        ->orWhereHas('users', function ($q) {
            $q->where('users.id', Auth::id());
        })
        ->get();

        $users = User::all();

        return Inertia::render('dashboard', [
            'groups' => $groups,
            'users' => $users
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'title' => 'required|string|min:3|max:255',
            'content' => 'required|string|min:10',
            'group' => 'required|numeric|exists:groups,id',
            'files' => 'array|max:5',
            'files.*' => 'file|mimes:jpg,jpeg,png,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,json,csv,zip,rar|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $post = Post::create([
                'title' => $request->title,
                'content' => $request->content,
                'group_id' => $request->group,
                'user_id' => Auth::id(),
            ]);

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('posts', 'public');
                    
                    $post->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'type' => str_contains($file->getClientMimeType(), 'image') ? 'image' : 'document',
                        'path' => $path,
                    ]);
                }
            }
            
            $response = [
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'files' => $post->attachments->map(function($file) {
                return [
                    'id' => $file->id,
                    'name' => $file->name,
                    'type' => $file->type,
                    'path' => $file->path,
                ];
            }),
            'status' => $post->status,
            'createdAt' => $post->created_at,
            'isSaved' => $post->saved_by_users?->where('id', Auth::id())->first() ? true : false,
            'isFollowing' => $post->followed_by_users?->where('id', Auth::id())->first() ? true : false,
            'group' => [
                'id' => $post->group->id,
                'name' => $post->group->name,
                'color' => $post->group->color,
            ],
            'author' => [
                'id' => $post->user->id,
                'name' => $post->user->name,
                'image' => $post->user->image,
            ],
            'comments' => [],
            ];

            DB::commit();

            // todo: optimize this
            $groups = Group::with('users')
            ->where('is_ffa', true)
            ->orWhereHas('users', function ($q) {
                $q->where('users.id', Auth::id());
            })
            ->get();

            $users = User::all();
            
            return response()->json([
                'new_post' => $response
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create post. '.$e->getMessage()]);
        }
    }
}
