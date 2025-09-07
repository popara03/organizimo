<?php

use App\Http\Controllers\admin\GroupController;
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
});

Route::middleware('auth', CheckUserRole::class)->group(function(){
    // group
    Route::post('create-group', [GroupController::class, 'store'])
        ->name('create-group');

    Route::put('update-group', [GroupController::class, 'update'])
        ->name('update-group');

    Route::delete('delete-group/{id}', [GroupController::class, 'destroy'])
        ->name('delete-group');
});