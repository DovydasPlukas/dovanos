<?php

namespace App\Repositories;

use App\Models\ItemAttribute;

class ItemAttributeRepository
{
    public function create(array $data): ItemAttribute
    {
        return ItemAttribute::create($data);
    }

    public function delete($id)
    {
        return ItemAttribute::destroy($id);
    }

    public function getByItemId($itemId)
    {
        return ItemAttribute::where('item_id', $itemId)->with('attribute')->get();
    }
}
