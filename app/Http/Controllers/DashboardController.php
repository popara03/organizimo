<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
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

        // todo: enum for post status

        return Inertia::render('dashboard', [
            'groups' => $groups,
            'users' => $users
        ]);
    }
}
