<?php

namespace App\Http\Controllers;

use App\Services\VendorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class VendorController extends Controller
{
    protected $vendorService;

    public function __construct(VendorService $vendorService)
    {
        $this->vendorService = $vendorService;
    }

    public function index()
    {
        if (!request()->expectsJson()) {
            return Inertia::render('ErrorPage')->toResponse(request())->setStatusCode(404);
        }

        $vendors = $this->vendorService->getAllVendors();
        return response()->json(['data' => $vendors]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'contact_details' => 'required|string',
            'website' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $vendor = $this->vendorService->createVendor($request->all());
            return response()->json($vendor, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function show($id)
    {
        if (!request()->expectsJson()) {
            return Inertia::render('ErrorPage')->toResponse(request())->setStatusCode(404);
        }

        try {
            $vendor = $this->vendorService->getVendor($id);
            return response()->json($vendor);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'contact_details' => 'sometimes|string',
            'website' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        try {
            $vendor = $this->vendorService->updateVendor($id, $request->all());
            return response()->json($vendor);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            $this->vendorService->deleteVendor($id);
            return response()->json(['message' => 'Vendor deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
    }
}