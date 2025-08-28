<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->middleware('guest')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// test route
Route::post('formPrint', function(Request $request){
    return dd($request->all());
})->name('formPrint');

Route::get('mjau', function () {
    return dd(User::find(4));
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';