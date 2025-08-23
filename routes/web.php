<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// test route
Route::post('print', function(Request $request){
    return dd($request->all());
})->name('print');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';