<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\CheckUserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Group;
use Illuminate\Support\Facades\Auth;

// test route
Route::post('print', function(Request $request){
    return dd($request->all());
})->name('print');

Route::get('/', function () {
    return Inertia::render('welcome');
})->middleware('guest')->name('home');


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('profile', function(){
        return Inertia::render('settings/profile');
    })->name('profile');
});


Route::middleware(['auth', CheckUserRole::class])->group(function () {
    Route::get('admin', [AdminController::class, 'index'])->name('admin');

    Route::get('admin/groups', [AdminController::class, 'groups'])->name('admin/groups');

    Route::get('admin/users', [AdminController::class, 'users'])->name('admin/users');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';