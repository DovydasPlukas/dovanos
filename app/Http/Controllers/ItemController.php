<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\RedirectLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    // Show the list of items
    public function index()
    {
        $items = Item::all();  // Fetch all items
        return response()->json($items);
    }

    public function create()
    {
        //
    }

    // Create a new item (Admin only)
    public function store(Request $request)
    {
        // Validate input data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image_url' => 'required|string',
            'vendor_id' => 'required|exists:vendors,id',
            'product_url' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Only admins can create items
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Create a new item
        $item = Item::create($request->all());

        return response()->json($item, 201);
    }
    // Show a single item by its ID
    public function show($id)
    {
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }
        return response()->json($item);
    }

    public function edit(string $id)
    {
        //
    }

    // Update an item (admin only)
    public function update(Request $request, $id)
    {
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }
    
        // Check if the user is an admin
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'vendor_id' => 'sometimes|exists:vendors,id',
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
        // Update the item
        $item->update($request->all());
        return response()->json($item);
    }
    
    // Delete an existing item (Admin only)
    public function destroy($id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Only admins can delete items
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the item
        $item->delete();

        return response()->json(['message' => 'Item deleted successfully']);
    }

    // Redirect the user and log the redirect (for tracking)
    public function redirect($item_id)
{
    $item = Item::find($item_id);
    if (!$item) {
        return response()->json(['message' => 'Item not found'], 404);
    }
    // Hash sukurimas
    $unique_hash = md5($item->id . request()->ip() . request()->userAgent() . request()->headers->get('referer'));
    
    // Hash tikrinimas
    $existingLog = RedirectLog::where('unique_hash', $unique_hash)->first();
    if ($existingLog) {
        return response()->json(['message' => 'Redirect already logged'], 200);
    }

    // Įrašymas naujo įrašo į redirect_logs
    RedirectLog::create([
        'item_id' => $item_id,
        'timestamp' => now(),
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
        'referrer' => request()->headers->get('referer'),
        'unique_hash' => $unique_hash
    ]);

    // Nukreipti vartotoją į produktą
    return redirect($item->product_url);
    }
}