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
        $users = User::all();

        return Inertia::render('admin/admin-groups', [
            'groups' => $groups,
            'users' => $users
        ]);
    }

    public function users()
    {
        return Inertia::render('admin/admin-users', [
            'users' => User::all(),
            'roles' => Role::all()
        ]);
    }
}
