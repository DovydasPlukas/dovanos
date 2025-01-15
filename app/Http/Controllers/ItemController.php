<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\RedirectLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    public function index()
    {
        // Fetch items and vendor from the database
        $items = Item::with('vendor')->get();
    
        // Check if the request expects a JSON response
        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $items,
            ]);
        }
    
        // Render the Inertia page for the website
        return Inertia::render('Items', ['items' => $items]);
    }


    // Create a new item (Admin only)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'vendor_id' => 'required|exists:vendors,id',
            'product_url' => 'required|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|string|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Only admins can create items
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Handle image
        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('images', 'public');
            $imagePath = 'storage/' . $imagePath;
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        // Create a new item
        $item = Item::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_url' => $imagePath,
            'vendor_id' => $request->vendor_id,
            'product_url' => $request->product_url,
        ]);

        return response()->json($item, 201);
    }

    // Show a single item by its ID
    public function show($id)
    {
        $item = Item::findOrFail($id);

        if (request()->expectsJson()) {
            // Return JSON for API clients like Postman
            return response()->json([
                'success' => true,
                'data' => $item,
            ]);
        }

        // Return Inertia response for the website
        return inertia('ItemDetail', ['item' => $item]);
    }


    // Update an item (admin only)
    public function update(Request $request, $id)
    {
        // Find the item by ID, return a 404 response if not found
        $item = Item::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Check if the user is an admin
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate incoming data
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'vendor_id' => 'sometimes|exists:vendors,id',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|string',
        ]);

        // Return validation errors if validation fails
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Handle image
        if ($request->hasFile('image_file')) {
            // Delete old image if it exists and is not a URL
            if ($item->image_url && !filter_var($item->image_url, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete(str_replace('storage/', '', $item->image_url));
            }
            $imagePath = $request->file('image_file')->store('images', 'public');
            $item->image_url = 'storage/' . $imagePath;
        } elseif ($request->filled('image_url')) {
            // Delete old image if it exists and is not a URL
            if ($item->image_url && !filter_var($item->image_url, FILTER_VALIDATE_URL)) {
                Storage::disk('public')->delete(str_replace('storage/', '', $item->image_url));
            }
            $item->image_url = $request->image_url;
        }

        // Update the item with the provided data (including optional image update)
        $item->fill($request->except(['image_file', 'image_url']));
        $item->save();

        // Return the updated item in the response
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

    // Redirect to the product URL and log the redirect
    public function redirect($item_id)
    {
        // Find the item
        $item = Item::find($item_id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }
    
        // Generate the unique hash based on IP, User-Agent, and timestamp
        $unique_hash = md5(request()->ip() . request()->userAgent() . now()->timestamp);
    
        // Check if there is a recent log with the same unique hash (e.g., within the last 5 seconds)
        $existingLog = RedirectLog::where('unique_hash', $unique_hash)
                                   ->where('timestamp', '>', now()->subSeconds(5))
                                   ->first();
    
        if ($existingLog) {
            return response()->json(['message' => 'Duplicate redirect attempt'], 200);
        }
    
        // Save the redirect log into the database
        RedirectLog::create([
            'item_id' => $item_id,
            'timestamp' => now(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'referrer' => request()->headers->get('referer'),
            'unique_hash' => $unique_hash
        ]);
    
        // Return the unique_hash to frontend for constructing the URL
        return response()->json(['unique_hash' => $unique_hash]);
    }
    
    // searchbar
    public function search(Request $request)
    {
        $query = $request->input('q');
        $items = Item::where('name', 'like', "%{$query}%")->get();
        return response()->json($items);
    }
}
