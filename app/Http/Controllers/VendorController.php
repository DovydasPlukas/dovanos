<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class VendorController extends Controller
{
    public function index()
    {
        $vendors = Vendor::all();
        return response()->json(['data' => $vendors]);
    }

    public function store(Request $request)
    {
        // Only admins can create vendors
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'contact_details' => 'required|string',
            'website' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $vendor = Vendor::create($request->all());
        return response()->json($vendor, 201);
    }

    public function show($id)
    {
        $vendor = Vendor::find($id);
        if (!$vendor) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }
        return response()->json($vendor);
    }

    public function update(Request $request, $id)
    {
        // Find the vendor by ID, return a 404 response if not found
        $vendor = Vendor::find($id);
        if (!$vendor) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }

        // Only admins can update vendors
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'contact_details' => 'sometimes|string',
            'website' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $vendor->update($request->all());
        return response()->json($vendor);
    }

    public function destroy($id)
    {
        // Find the vendor by ID, return a 404 response if not found
        $vendor = Vendor::find($id);
        if (!$vendor) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }

        // Only admins can delete vendors
        if (!Auth::user() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $vendor->delete();
        return response()->json(null, 204);
    }
}