<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\RedirectLog;
use App\Services\ItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ItemController extends Controller
{
    protected $itemService;

    public function __construct(ItemService $itemService)
    {
        $this->itemService = $itemService;
    }

    public function index()
    {
        $items = $this->itemService->getAllItems();
        
        if (request()->expectsJson()) {
            return response()->json([
                'success' => true,
                'data' => $items,
            ]);
        }
        
        return Inertia::render('Items', ['items' => $items]);
    }
    // Add an item (admin only)
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

        try {
            $item = $this->itemService->createItem($request->all());
            return response()->json($item, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function show($id)
    {
        try {
            $item = $this->itemService->getItem($id);
            
            if (request()->expectsJson()) {
                return response()->json(['success' => true, 'data' => $item]);
            }
            
            return Inertia::render('ItemDetail', ['item' => $item]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Item not found'], 404);
        }
    }

    // Update an item (admin only)
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'vendor_id' => 'sometimes|exists:vendors,id',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $item = $this->itemService->updateItem($id, $request->all());
            return response()->json($item);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    // Delete an existing item (Admin only)
    public function destroy($id)
    {
        try {
            $this->itemService->deleteItem($id);
            return response()->json(['message' => 'Item deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    // Redirect to the product URL and log the redirect
    public function redirect($item_id)
    {
        try {
            $item = $this->itemService->getItem($item_id);
            
            // Generate unique hash
            $unique_hash = md5(request()->ip() . request()->userAgent() . now()->timestamp);
            
            // Check for recent duplicate
            $existingLog = RedirectLog::where('unique_hash', $unique_hash)
                                    ->where('timestamp', '>', now()->subSeconds(5))
                                    ->first();
            
            if ($existingLog) {
                return response()->json(['message' => 'Duplicate redirect attempt'], 200);
            }
            
            // Create redirect log
            RedirectLog::create([
                'item_id' => $item_id,
                'timestamp' => now(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'referrer' => request()->headers->get('referer'),
                'unique_hash' => $unique_hash
            ]);
            
            return response()->json(['unique_hash' => $unique_hash]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Item not found'], 404);
        }
    }
    
    // Searchbar
    public function search(Request $request)
    {
        $query = $request->input('q');
        return response()->json($this->itemService->searchItems($query));
    }
}