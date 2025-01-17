<?php

namespace App\Http\Controllers;

use App\Services\FeaturedItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FeaturedItemController extends Controller
{
    protected $featuredItemService;

    public function __construct(FeaturedItemService $featuredItemService)
    {
        $this->featuredItemService = $featuredItemService;
    }

    public function index()
    {
        if (!request()->expectsJson()) {
            return Inertia::render('ErrorPage')->toResponse(request())->setStatusCode(404);
        }

        return response()->json($this->featuredItemService->getAllFeaturedItems());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_id' => 'required|exists:items,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $featuredItem = $this->featuredItemService->createFeaturedItem($request->all());
            return response()->json($featuredItem, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:featured_items,id',
            'direction' => 'required|in:up,down',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $this->featuredItemService->reorderFeaturedItem($request->all());
            return response()->json(['message' => 'Position updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            $this->featuredItemService->deleteFeaturedItem($id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }
}