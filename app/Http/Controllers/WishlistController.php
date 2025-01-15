<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlistItems = Wishlist::where('user_id', Auth::id())
            ->with('item')
            ->get()
            ->map(function ($wishlist) {
                return $wishlist->item;
            });

        return Inertia::render('Wishlist', [
            'items' => $wishlistItems,
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function toggle($itemId)
    {
        $userId = Auth::id();
        $wishlist = Wishlist::where('user_id', $userId)
            ->where('item_id', $itemId)
            ->first();

        if ($wishlist) {
            $wishlist->delete();
            return response()->json(['inWishlist' => false]);
        }

        Wishlist::create([
            'user_id' => $userId,
            'item_id' => $itemId
        ]);

        return response()->json(['inWishlist' => true]);
    }

    public function check($itemId)
    {
        $exists = Wishlist::where('user_id', Auth::id())
            ->where('item_id', $itemId)
            ->exists();

        return response()->json(['inWishlist' => $exists]);
    }
}
