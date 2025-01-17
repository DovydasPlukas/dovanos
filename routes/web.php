<?php

use App\Http\Controllers\FeaturedItemController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\XMLController;
use App\Http\Controllers\AttributeController;
use App\Http\Controllers\ItemAttributeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public web routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('index');

// Auth required routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (admin only)
    Route::get('/dashboard', function (Request $request) {
        $user = Auth::user();
        if (!$user || !$user->is_admin) {
            return Inertia::render('ErrorPage')->toResponse(request())->setStatusCode(404);
        }
        return Inertia::render('Dashboard', [
            'user' => $user,
            'initialTab' => $request->query('tab', 'dashboard'),
        ]);
    })->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
    Route::post('/wishlist/toggle/{item_id}', [WishlistController::class, 'toggle']);
    Route::get('/wishlist/check/{item_id}', [WishlistController::class, 'check']);
});

// Public API routes (60 requests per minute)
Route::middleware('throttle:public')->group(function () {
    Route::get('/items', [ItemController::class, 'index']);
    Route::get('/items/{id}', [ItemController::class, 'show']);
    Route::get('/redirect/{item_id}', [ItemController::class, 'redirect']);
    Route::get('/api/search', [ItemController::class, 'search']);
    Route::get('/featured-items', [FeaturedItemController::class, 'index']);
});

// Admin API routes (100 requests per minute)
Route::middleware(['auth:sanctum', 'throttle:admin'])->group(function () {
    // Items management
    Route::post('/items', [ItemController::class, 'store']);
    Route::put('/items/{id}', [ItemController::class, 'update']);
    Route::delete('/items/{id}', [ItemController::class, 'destroy']);

    // Vendors management
    Route::resource('vendors', VendorController::class);

    // Featured Items management
    Route::post('/featured-items', [FeaturedItemController::class, 'store']);
    Route::delete('/featured-items/{id}', [FeaturedItemController::class, 'destroy']);
    Route::post('/featured-items/reorder', [FeaturedItemController::class, 'reorder']);

    // XML upload
    Route::post('/upload-xml', [XMLController::class, 'uploadXML']);

    // Attribute management
    Route::prefix('api/attributes')->group(function () {
        // Attribute Groups
        Route::get('/groups', [AttributeController::class, 'getAllGroups']);
        Route::post('/groups', [AttributeController::class, 'createGroup']);
        Route::put('/groups/{id}', [AttributeController::class, 'updateGroup']);
        Route::delete('/groups/{id}', [AttributeController::class, 'deleteGroup']);
        
        // Attributes
        Route::get('/', [AttributeController::class, 'getAllAttributes']);
        Route::get('/group/{groupId}', [AttributeController::class, 'getAttributesByGroup']);
        Route::post('/', [AttributeController::class, 'createAttribute']);
        Route::put('/{id}', [AttributeController::class, 'updateAttribute']);
        Route::delete('/{id}', [AttributeController::class, 'deleteAttribute']);
    });

    // Item Attributes management
    Route::post('/item-attributes', [ItemAttributeController::class, 'store']);
    Route::delete('/item-attributes/{id}', [ItemAttributeController::class, 'destroy']);
    Route::get('/item-attributes/{itemId}', [ItemAttributeController::class, 'getItemAttributes']);
});

// Static pages
Route::get('/apie', function () {
    return Inertia::render('About');
});
Route::get('/kontaktai', function () {
    return Inertia::render('Contact');
});
Route::get('/edit', function () {
    return Inertia::render('Edit-page');
});

// Auth routes
require __DIR__.'/auth.php';

// Fallback route
Route::fallback(function () {
    return Inertia::render('ErrorPage')->toResponse(request())->setStatusCode(404);
});

// To test out API using Postman (check user)
Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
    return response()->json($request->user());
});