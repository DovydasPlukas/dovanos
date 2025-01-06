<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        // Fetch all items or fetch wishlist-specific items
        $items = Item::all();  // You might want to adjust this to only fetch wishlist items

        return Inertia::render('Wishlist', [
            'items' => $items
        ]);
    }
}
