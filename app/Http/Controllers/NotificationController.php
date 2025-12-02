<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Post;
use App\Models\User;
use BcMath\Number;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use phpDocumentor\Reflection\Types\Boolean;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        assert($user instanceof User);

        $pageNotifications = $user?->notifications()
        ->with('usersNotified')
        ->orderByDesc('created_at')
        ->skip(10)
        ->take(15)
        ->get()
        ->map(function ($n){
            $post = Post::find($n->post_id);
            
            return [
                'id' => $n->id,
                'type' => $n->type->name,
                'post' => $post ?
                    [
                        'id' => $post->id,
                        'title' => $post->title,
                        'status' => $post->status,
                        'author' => [
                            'id' => $post->user->id,
                            'name' => $post->user->name,
                        ],
                    ] : null,
                'comment_id' => $n->comment_id,
                'user' => $n->user_id ?
                    [
                        'id' => $n->user_id,
                        'name' => User::find($n->user_id)?->name,
                    ] : null,
                'message' => $n->message,
                'is_read' => (bool) $n->pivot->is_read,
                'created_at' => $n->created_at->toISOString(),
                'server_time' => now()->toISOString(),
            ];
        });

        return Inertia::render('notifications', ['pageNotifications' => $pageNotifications]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if(!$id)
            throw new Error("Notification ID is missing or invalid.");

        $notification = Notification::findOrFail($id);

        $user = Auth::user();
        assert($user instanceof User);
        $user->notifications()->detach($notification->id);

        return response()->json([
            'message' => 'Notification deleted successfully.'
        ], 200);
    }

    public function markAsRead(Request $request, string $id){
        // validate input
        if(!$id)
            throw new Error("Notification ID is missing or invalid.");

        $notification = Notification::findOrFail($id);
        
        $user = Auth::user();
        assert($user instanceof User);
        
        $user->notifications()->updateExistingPivot($notification->id, [
            'is_read' => $request['is_read']
        ]);

        return response()->json([
            'message' => 'Notification updated successfully.'
        ], 200);
    }

    public function markAllAsRead(){
        $user = Auth::user();
        assert($user instanceof User);

        $user->notifications()
            ->wherePivot('is_read', false)
            ->update(['is_read' => true]);
    }
}
