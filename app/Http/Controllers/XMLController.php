<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Vendor;
use Illuminate\Support\Facades\Log;

class XMLController extends Controller
{
    public function uploadXML(Request $request)
    {
        $request->validate([
            'xml_file' => 'required|file|mimes:xml',
            'vendor_id' => 'required|exists:vendors,id',
        ]);

        $file = $request->file('xml_file');
        $vendorId = $request->input('vendor_id');

        try {
            $xml = simplexml_load_file($file->path());
            
            if (!$xml || !isset($xml->product)) {
                return response()->json(['message' => 'Invalid XML file format'], 400);
            }

            $savedItems = [];

            foreach ($xml->product as $product) {
                $item = new Item([
                    'name' => (string)$product->title,
                    'description' => (string)($product->description ?? ''),
                    'price' => (float)$product->price,
                    'image_url' => (string)($product->image_url ?? ''),
                    'vendor_id' => $vendorId,
                    'product_url' => (string)($product->product_url ?? ''),
                ]);

                $item->save();
                $savedItems[] = $item;
            }

            return response()->json([
                'message' => 'Products uploaded successfully',
                'data' => $savedItems
            ], 201);
        } catch (\Exception $e) {
            Log::error('XML Upload Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing XML file'], 500);
        }
    }
}