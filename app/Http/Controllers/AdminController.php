<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/index');
    }

    public function groups()
    {
        $groups = Group::with('users')->get();
        $users = User::select('id', 'name', 'image')
            ->with(['groups:id,name,color'])
            ->get();

        return Inertia::render('admin/groups', [
            'groups' => $groups,
            'users' => $users
        ]);
    }

    public function users()
    {
        $users = User::select()
        ->with('role:id,name')
        ->orderBy('created_at', 'desc')
        ->get()
        ->makeVisible('email');

        return Inertia::render('admin/users', [
            'users' => $users,
            'roles' => Role::all()
        ]);
    }
}
