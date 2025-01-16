<?php

namespace App\Http\Controllers;

use App\Models\FeaturedItem;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class FeaturedItemController extends Controller
{
    public function index()
    {
        $featuredItems = FeaturedItem::with(['item.vendor'])->get()->map(function ($featuredItem) {
            return [
                'id' => $featuredItem->id,
                'item_id' => $featuredItem->item_id,
                'name' => $featuredItem->item->name,
                'vendor_name' => $featuredItem->item->vendor->name,
                'description' => $featuredItem->item->description,
                'price' => $featuredItem->item->price,
                'image_url' => $featuredItem->item->image_url,
                'product_url' => $featuredItem->item->product_url,
                'start_date' => $featuredItem->start_date->format('Y-m-d'),
                'end_date' => $featuredItem->end_date->format('Y-m-d'),
            ];
        });

        return response()->json($featuredItems);
    }

    public function store(Request $request)
    {
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'item_id' => 'required|exists:items,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $featuredItemsCount = FeaturedItem::count();
        if ($featuredItemsCount >= 5) {
            return response()->json(['error' => 'Maximum number of featured items reached'], 422);
        }

        $featuredItem = FeaturedItem::create($request->all());

        return response()->json($featuredItem, 201);
    }

    public function destroy($id)
    {
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $featuredItem = FeaturedItem::findOrFail($id);
        $featuredItem->delete();

        return response()->json(null, 204);
    }
}