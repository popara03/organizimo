<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Middleware\CheckUserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// test route
Route::post('print', function(Request $request){
    return dd($request->all());
})->name('print');

Route::get('/', function () {
    return Inertia::render('welcome');
})->middleware('guest')->name('home');


// authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [PostController::class, 'index'])->name('dashboard');

    Route::get('profile', function(){
        return Inertia::render('settings/profile');
    })->name('profile');

    Route::get('notifications', [NotificationController::class, 'index'])
    ->name('notifications');
});

// admin routes
Route::middleware(['auth', CheckUserRole::class])->group(function () {
    Route::get('admin', [AdminController::class, 'index'])->name('admin');

    Route::get('admin/groups', [AdminController::class, 'groups'])->name('admin/groups');

    Route::get('admin/users', [AdminController::class, 'users'])->name('admin/users');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';