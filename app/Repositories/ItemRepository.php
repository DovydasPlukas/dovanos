<?php

namespace App\Repositories;

use App\Models\Item;
use App\Repositories\Interfaces\ItemRepositoryInterface;

class ItemRepository implements ItemRepositoryInterface
{
    protected $model;

    public function __construct(Item $model)
    {
        $this->model = $model;
    }

    public function getAllItems()
    {
        return $this->model->with('vendor')->get();
    }

    public function getItemById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function createItem(array $data)
    {
        return $this->model->create($data);
    }

    public function updateItem($id, array $data)
    {
        $item = $this->model->findOrFail($id);
        $item->update($data);
        return $item;
    }

    public function deleteItem($id)
    {
        return $this->model->findOrFail($id)->delete();
    }

    public function searchItems($query)
    {
        return $this->model->where('name', 'like', "%{$query}%")->get();
    }
}
