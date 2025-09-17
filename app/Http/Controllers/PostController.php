<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Post;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use phpDocumentor\Reflection\Types\Integer;

class PostController extends Controller
{
    public function index(){
        $groups = Group::with('users')
        ->where('is_ffa', true)
        ->orWhereHas('users', function ($q) {
            $q->where('users.id', Auth::id());
        })
        ->get();

        $posts = Post::with(['group', 'user', 'attachments', 'savedByUsers', 'followedByUsers', 'comments'])
        ->where(function ($query) use ($groups) {
            $query->whereIn('group_id', $groups->pluck('id'));
        })
        ->orderBy('created_at', 'desc')
        ->get();

        // just fetch all users that are listed in the previously fetched posts, since it's for filter purpose
        $users = User::whereIn('id', $posts->pluck('user_id'))->get();

        return Inertia::render('dashboard', [
            'groups' => $groups,
            'users' => $users,
            'posts' => $posts->map(function($post) {
                return [
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
                    'isSaved' => $post->savedByUsers?->where('id', Auth::id())->first() ? true : false,
                    'isFollowing' => $post->followedByUsers?->where('id', Auth::id())->first() ? true : false,
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
                    'comments' => $post->comments()->with('user')->get()->map(function($comment) {
                        return [
                            'id' => $comment->id,
                            'content' => $comment->content,
                            'createdAt' => $comment->created_at,
                            'author' => [
                                'id' => $comment->user->id,
                                'name' => $comment->user->name,
                                'image' => $comment->user->image,
                            ],
                        ];
                    }),
                ];
            })
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
            'isSaved' => $post->savedByUsers?->where('id', Auth::id())->first() ? true : false,
            'isFollowing' => $post->followedByUsers?->where('id', Auth::id())->first() ? true : false,
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

            // todo: optimize this with axios call in frontend in stead inertia form submit
            $groups = Group::with('users')
            ->where('is_ffa', true)
            ->orWhereHas('users', function ($q) {
                $q->where('users.id', Auth::id());
            })
            ->get();

            $users = User::all();
            
            return Inertia::render('dashboard', [
                'new_post' => $response,
                'groups' => $groups,
                'users' => $users
            ])->with('success', 'Post created successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create post. '.$e->getMessage()]);
        }
    }

    public function edit(Request $request ){
        $request->validate([
            'title' => 'required|string|min:3|max:255',
            'content' => 'required|string|min:10',
            'files' => 'array|max:5',
            'files.*' => 'file|mimes:jpg,jpeg,png,webp,pdf,doc,docx,xls,xlsx,ppt,pptx,txt,json,csv,zip,rar|max:2048',
        ]);

        // id check
        if(!$request->post_id || !is_numeric($request->post_id)){
            return back()->withErrors(['error' => 'Invalid post ID.']);
        }

        // find post
        $post = Post::find($request->post_id);
        if (!$post) {
            return back()->withErrors(['error' => 'Post not found.']);
        }

        // check if the authenticated user is the owner of the post or admin
        if ($post->user_id !== Auth::id() && Auth::user()->role->name !== 'admin') {
            return back()->withErrors(['error' => 'You are not authorized to edit this post.']);
        }

        // update post
        $post->update([
            'title' => $request->title,
            'content' => $request->content,
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

        return redirect()->route('posts.index')->with('success', 'Post updated successfully.');
    }

    public function changeStatus(int $id, Request $request){
        try {
            $request->validate([
                'status' => 'required|boolean',
            ]);

            // id check
            if(!$id || !is_numeric($id)){
                return request()->json(['error' => 'Invalid post ID.'], 400);
            }

            // find post
            $post = Post::find($id);
            if (!$post) {
                return request()->json(['error' => 'Post not found.'], 404);
            }

            // check if the authenticated user is the owner of the post or admin
            if ($post->user_id !== Auth::id() && Auth::user()->role->name !== 'admin') {
                return request()->json(['error' => 'You are not authorized to change the status of this post.'], 403);
            }

            $post->update([
                'status' => $request->status,
            ]);

            return request()->json(['success' => 'Post status updated successfully.'], 200);
        } catch (Exception $e) {
            return request()->json(['error' => 'Failed to change post status. '.$e->getMessage()], 500);
        }
    }

    public function savePost(int $id){
        try{
            // id check
            if(!$id || !is_numeric($id)){
                return response()->json(['error' => 'Invalid post ID.'], 400);
            }

            // find post
            $post = Post::with('savedByUsers')->find($id);
            if (!$post) {
                return response()->json(['error' => 'Post not found.'], 404);
            }

            $user = Auth::user();
            if ($post->savedByUsers->contains($user->id)) {
                // unsave
                $post->savedByUsers()->detach($user->id);
                return response()->json(['success' => 'Post unsaved successfully.', 'isSaved' => false], 200);
            } else {
                // save
                $post->savedByUsers()->attach($user->id);
                return response()->json(['success' => 'Post saved successfully.', 'isSaved' => true], 200);
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to toggle save post. '.$e->getMessage()], 500);
        }
    }

    public function followPost(int $id){
        try{
            // id check
            if(!$id || !is_numeric($id)){
                return response()->json(['error' => 'Invalid post ID.'], 400);
            }

            // find post
            $post = Post::with('followedByUsers')->find($id);
            if (!$post) {
                return response()->json(['error' => 'Post not found.'], 404);
            }

            $user = Auth::user();
            if ($post->followedByUsers->contains($user->id)) {
                // unfollow
                $post->followedByUsers()->detach($user->id);
                return response()->json(['success' => 'Post unfollowed successfully.', 'isFollowing' => false], 200);
            } else {
                // follow
                $post->followedByUsers()->attach($user->id);
                return response()->json(['success' => 'Post followed successfully.', 'isFollowing' => true], 200);
            }
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to toggle follow post. '.$e->getMessage()], 500);
        }
    }

    public function destroy(int $id){
        try{
            // id check
            if(!$id || !is_numeric($id)){
                return response()->json(['error' => 'Invalid post ID.'], 400);
            }

            // find post
            $post = Post::find($id);
            if (!$post) {
                return response()->json(['error' => 'Post not found.'], 404);
            }

            // check if the authenticated user is the owner of the post or admin
            if ($post->user_id !== Auth::id() && Auth::user()->role->name !== 'admin') {
                return response()->json(['error' => 'You are not authorized to delete this post.'], 403);
            }

            // delete attachments
            foreach ($post->attachments as $attachment) {
                // delete file from storage
                Storage::disk('public')->delete($attachment->path);
                
                // delete attachment record
                // $attachment->delete(); // cascade on delete is set in the migration
            }

            // delete post
            $post->delete();
            return response()->json(['success' => 'Post deleted successfully.'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete post. '.$e->getMessage()], 500);
        }
    }
}
