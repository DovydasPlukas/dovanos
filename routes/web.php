<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\WishlistController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// TODO: modify routes to send data through Inertia (don't show inside div with inspect element)

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('index');

Route::get('/dashboard', function (Request $request) {
    $user = Auth::user();

    if (!$user || !$user->is_admin) {
        return Inertia::render('ErrorPage')->toResponse(request())->setStatusCode(404);
    }

    return Inertia::render('Dashboard', [
        'user' => $user,
        'initialTab' => $request->query('tab', 'dashboard'), // Default to 'dashboard' if no tab is provided
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

//API endpoints

// Public routes (requests 60 per minute)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/items', [ItemController::class, 'index']);                 // gauti prekių sąrašą
    Route::get('/items/{id}', [ItemController::class, 'show']);             // gauti konkrečios prekės informaciją
    Route::get('/redirect/{item_id}', [ItemController::class, 'redirect']); // registruoti nukreipimą ir nukreipti vartotoją
});

// Admin routes (requests 10 per minute)
Route::middleware(['auth:sanctum', 'throttle:10,1'])->group(function () {
    Route::post('/items', [ItemController::class, 'store']);                // pridėti naują prekę (admin)
    Route::put('/items/{id}', [ItemController::class, 'update']);           // redaguoti prekę (admin)
    Route::delete('/items/{id}', [ItemController::class, 'destroy']);       // ištrinti prekę (admin)
});


// Vendor routes
Route::middleware(['auth:sanctum', 'throttle:10,1'])->group(function () {
    Route::resource('vendors', VendorController::class);
});

// Other routes
Route::get('/apie', function () {
    return Inertia::render('About');
});
Route::get('/kontaktai', function () {
    return Inertia::render('Contact'); 
});
Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');

Route::get('/edit', function () {
    return Inertia::render('Edit-page'); 
});

//API routes
// To test out API (delete later)
Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return response()->json($request->user());
});

// Fallback route
Route::fallback(function () {
    return Inertia::render('ErrorPage')->toResponse(request())->setStatusCode(404);
});
