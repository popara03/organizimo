<?php

namespace App\Http\Middleware;

use App\Models\Group;
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
        $active_user = Auth::user() ? Auth::user() : null;
        if ($active_user && $active_user instanceof User) {
            $active_user->load('role');
        }

        // if admin, load all groups
        $allGroups = [];
        if( $active_user && $active_user instanceof User && $active_user->role?->name === 'admin' ) {
            $allGroups = Group::all();
        }

        return [
            ...parent::share($request),
            //app name
            'name' => config('app.name'),
            // authenticated user data
            'active_user' => $active_user,
            'allGroups' => $allGroups,
        ];
    }
}