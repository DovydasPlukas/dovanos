<?php

namespace App\Http\Controllers;

use App\Services\ItemAttributeService;
use Illuminate\Http\Request;

class ItemAttributeController extends Controller
{
    protected $itemAttributeService;

    public function __construct(ItemAttributeService $itemAttributeService)
    {
        $this->itemAttributeService = $itemAttributeService;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'attribute_id' => 'required|exists:attributes,id',
        ]);

        $itemAttribute = $this->itemAttributeService->createItemAttribute($validated);

        return response()->json($itemAttribute, 201);
    }

    public function destroy($id)
    {
        $this->itemAttributeService->deleteItemAttribute($id);

        return response()->json(['message' => 'Požymis sėkmingai pašalintas'], 200);
    }

    public function getItemAttributes($itemId)
    {
        $itemAttributes = $this->itemAttributeService->getItemAttributes($itemId);

        return response()->json($itemAttributes);
    }
}
