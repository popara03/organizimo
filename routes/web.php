<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('register', function () {
    return Inertia::render('auth/Register');
})->name('register');

Route::get('login', function () {
    return Inertia::render('auth/Login');
})->name('login');

// TEST LINK
Route::post('kurac', function(Request $request){
    return dd($request->all());
})->name('kurac');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';