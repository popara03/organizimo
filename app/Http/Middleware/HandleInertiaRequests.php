<?php

namespace App\Http\Middleware;

use App\Models\Group;
use App\Models\Notification;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // authenticated user with role relation
        $active_user = Auth::user();
        assert($active_user instanceof User || $active_user === null);  //type check for IDE in development
        $active_user?->load('role');

        // if admin, load all groups
        $allGroups = $active_user?->role->name === 'admin' ? Group::all() : [];

        // load last 10 notifications
        $notifications = $active_user?->notifications()
        ->with('usersNotified')
        ->orderByDesc('created_at')
        ->take(10)
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

        return [
            ...parent::share($request),
            //app name
            'name' => config('app.name'),
            // authenticated user data
            'active_user' => $active_user,
            'allGroups' => $allGroups,
            'notifications' => $notifications,
        ];
    }
}