<?php

namespace App\Http\Controllers;

use App\Services\AttributeService;
use App\Services\AttributeGroupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AttributeController extends Controller
{
    protected $attributeService;
    protected $groupService;

    public function __construct(AttributeService $attributeService, AttributeGroupService $groupService)
    {
        $this->attributeService = $attributeService;
        $this->groupService = $groupService;
    }

    public function getAllAttributes()
    {
        return response()->json($this->attributeService->getAllAttributes());
    }

    public function getAllGroups()
    {
        try {
            $groups = $this->groupService->getAllGroups();
            Log::info('Sending groups response:', ['count' => count($groups)]);
            return response()->json($groups);
        } catch (\Exception $e) {
            Log::error('Error in getAllGroups: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve attribute groups',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function createAttribute(Request $request)
    {
        try {
            $attribute = $this->attributeService->createAttribute($request->all());
            return response()->json($attribute, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function createGroup(Request $request)
    {
        try {
            $group = $this->groupService->createGroup($request->all());
            return response()->json($group, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function updateAttribute(Request $request, $id)
    {
        try {
            $attribute = $this->attributeService->updateAttribute($id, $request->all());
            return response()->json($attribute);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function updateGroup(Request $request, $id)
    {
        try {
            $group = $this->groupService->updateGroup($id, $request->all());
            return response()->json($group);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function deleteAttribute($id)
    {
        try {
            $this->attributeService->deleteAttribute($id);
            return response()->json(['message' => 'Attribute deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function deleteGroup($id)
    {
        try {
            $this->groupService->deleteGroup($id);
            return response()->json([
                'message' => 'Group deleted successfully',
                'status' => 'success'
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => 'error'
            ], 400);
        } catch (\Exception $e) {
            Log::error('Error in deleteGroup: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete group',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAttributesByGroup($groupId)
    {
        try {
            $attributes = $this->attributeService->getAttributesByGroup($groupId);
            return response()->json($attributes);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
