<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

//API endpoints

// Public routes: No authentication required (requests 60 per minute)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/items', [ItemController::class, 'index']);                 // gauti prekių sąrašą
    Route::get('/items/{id}', [ItemController::class, 'show']);             // gauti konkrečios prekės informaciją
    Route::get('/redirect/{item_id}', [ItemController::class, 'redirect']); // registruoti nukreipimą ir nukreipti vartotoją
});

// Admin routes: Requires authentication and has a rate limit (requests 10 per minute)
Route::middleware(['auth:api', 'throttle:10,1'])->group(function () {
    Route::post('/items', [ItemController::class, 'store']);                // pridėti naują prekę (admin)
    Route::put('/items/{id}', [ItemController::class, 'update']);           // redaguoti prekę (admin)
    Route::delete('/items/{id}', [ItemController::class, 'destroy']);       // ištrinti prekę (admin)
});
