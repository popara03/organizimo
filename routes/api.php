<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function(){
    //change user details
    Route::post('update-profile', [ProfileController::class, 'update'])
        ->name('update-profile');

    // change password
    Route::post('change-password', [PasswordController::class, 'update'])
        ->name('change-password');
});