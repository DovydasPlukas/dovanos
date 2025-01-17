<?php

namespace App\Services;

use App\Repositories\Interfaces\AttributeGroupRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;

class AttributeGroupService
{
    protected $groupRepository;

    public function __construct(AttributeGroupRepositoryInterface $groupRepository)
    {
        $this->groupRepository = $groupRepository;
    }

    public function getAllGroups()
    {
        try {
            $groups = $this->groupRepository->all();
            Log::info('Retrieved groups:', ['count' => $groups->count()]);
            return $groups->toArray();
        } catch (\Exception $e) {
            Log::error('Error getting attribute groups: ' . $e->getMessage());
            throw $e;
        }
    }

    public function createGroup(array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255|unique:attribute_groups'
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        return $this->groupRepository->create($data);
    }

    public function updateGroup($id, array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255|unique:attribute_groups,name,' . $id
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        return $this->groupRepository->update($id, $data);
    }

    public function deleteGroup($id)
    {
        try {
            $group = $this->groupRepository->find($id);
            if (!$group) {
                throw new InvalidArgumentException("Group not found");
            }
            
            // Check if group has any attributes before deletion
            if ($group->attributes()->count() > 0) {
                throw new InvalidArgumentException("Cannot delete group with existing attributes");
            }

            return $this->groupRepository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error deleting group: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getGroupsWithAttributes()
    {
        return $this->groupRepository->getWithAttributes();
    }
}
