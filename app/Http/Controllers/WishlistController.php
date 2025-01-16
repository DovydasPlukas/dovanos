<?php

namespace App\Http\Controllers;

use App\Services\WishlistService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    protected $wishlistService;

    public function __construct(WishlistService $wishlistService)
    {
        $this->wishlistService = $wishlistService;
    }

    public function index()
    {
        return Inertia::render('Wishlist', [
            'items' => $this->wishlistService->getWishlistItems(),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function toggle($itemId)
    {
        return response()->json($this->wishlistService->toggleWishlistItem($itemId));
    }

    public function check($itemId)
    {
        return response()->json($this->wishlistService->checkWishlistItem($itemId));
    }
}
