<?php

namespace App\Services;

use App\Repositories\Interfaces\AttributeRepositoryInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
use App\Models\Attribute;

class AttributeService
{
    protected $attributeRepository;

    public function __construct(AttributeRepositoryInterface $attributeRepository)
    {
        $this->attributeRepository = $attributeRepository;
    }

    public function getAllAttributes()
    {
        return $this->attributeRepository->all();
    }

    public function createAttribute(array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'attribute_group_id' => 'required|exists:attribute_groups,id'
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        try {
            $attribute = Attribute::create([
                'name' => $data['name'],
                'attribute_group_id' => $data['attribute_group_id']
            ]);

            return $attribute;
        } catch (\Exception $e) {
            Log::error('Failed to create attribute: ' . $e->getMessage());
            throw new InvalidArgumentException('Failed to create attribute');
        }
    }

    public function updateAttribute($id, array $data)
    {
        $validator = Validator::make($data, [
            'name' => 'sometimes|string|max:255',
            'attribute_group_id' => 'sometimes|exists:attribute_groups,id'
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        return $this->attributeRepository->update($id, $data);
    }

    public function deleteAttribute($id)
    {
        return $this->attributeRepository->delete($id);
    }

    public function getAttributesByGroup($groupId)
    {
        return Attribute::where('attribute_group_id', $groupId)->get();
    }
}
