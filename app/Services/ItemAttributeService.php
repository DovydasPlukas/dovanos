<?php

namespace App\Services;

use App\Repositories\ItemAttributeRepository;

class ItemAttributeService
{
    protected $itemAttributeRepository;

    public function __construct(ItemAttributeRepository $itemAttributeRepository)
    {
        $this->itemAttributeRepository = $itemAttributeRepository;
    }

    public function createItemAttribute(array $data)
    {
        return $this->itemAttributeRepository->create($data);
    }

    public function deleteItemAttribute($id)
    {
        return $this->itemAttributeRepository->delete($id);
    }

    public function getItemAttributes($itemId)
    {
        return $this->itemAttributeRepository->getByItemId($itemId);
    }
}
