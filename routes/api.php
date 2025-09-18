<?php

use App\Http\Controllers\admin\GroupController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Middleware\CheckUserRole;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
    //change user details
    Route::post('update-profile', [ProfileController::class, 'update'])
        ->name('update-profile');

    // change password
    Route::post('change-password', [PasswordController::class, 'update'])
        ->name('change-password');

    // posts
    Route::post('create-post', [PostController::class, 'store'])
        ->name('create-post');

    Route::post('update-post', [PostController::class, 'update'])
        ->name('update-post');

    Route::post('change-post-status/{id}', [PostController::class, 'changeStatus'])
        ->name('change-post-status');

    Route::post('save-post/{id}', [PostController::class, 'savePost'])
        ->name('save-post');

    Route::post('follow-post/{id}', [PostController::class, 'followPost'])
        ->name('follow-post');

    Route::delete('delete-post/{id}', [PostController::class, 'destroy'])
        ->name('delete-post');

    Route::post('filter-posts', [PostController::class, 'filterPosts'])
        ->name('filter-posts');

    // comments
    Route::post('submit-comment', [CommentController::class, 'store'])
        ->name('submit-comment');

    Route::post('update-comment/{id}', [CommentController::class, 'update'])
        ->name('update-comment');

    Route::post('delete-comment/{id}', [CommentController::class, 'destroy'])
        ->name('delete-comment');
});

// Admin dashboard endpoints
Route::middleware('auth', CheckUserRole::class)->group(function(){
    // group
    Route::post('create-group', [GroupController::class, 'store'])
        ->name('create-group');

    Route::put('update-group', [GroupController::class, 'update'])
        ->name('update-group');

    Route::delete('delete-group/{id}', [GroupController::class, 'destroy'])
        ->name('delete-group');

    //user
    Route::post('create-user', [UserController::class, 'store'])
        ->name('create-user');

    Route::post('update-user', [UserController::class, 'update'])   //post, inertia serialization issue w put
        ->name('update-user');

    Route::delete('delete-user/{id}', [UserController::class, 'destroy'])
        ->name('delete-user');
});