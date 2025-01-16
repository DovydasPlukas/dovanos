<?php

namespace App\Repositories;

use App\Models\FeaturedItem;
use App\Repositories\Interfaces\FeaturedItemRepositoryInterface;

class FeaturedItemRepository implements FeaturedItemRepositoryInterface
{
    protected $model;

    public function __construct(FeaturedItem $model)
    {
        $this->model = $model;
    }

    public function getAllWithItems()
    {
        return $this->model->with(['item.vendor'])->get()->map(function ($featuredItem) {
            return [
                'id' => $featuredItem->id,
                'item_id' => $featuredItem->item_id,
                'name' => $featuredItem->item->name,
                'vendor_name' => $featuredItem->item->vendor->name,
                'description' => $featuredItem->item->description,
                'price' => $featuredItem->item->price,
                'image_url' => $featuredItem->item->image_url,
                'product_url' => $featuredItem->item->product_url,
                'start_date' => $featuredItem->start_date->format('Y-m-d'),
                'end_date' => $featuredItem->end_date->format('Y-m-d'),
            ];
        });
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function delete($id)
    {
        return $this->model->findOrFail($id)->delete();
    }

    public function count()
    {
        return $this->model->count();
    }

    public function findOrFail($id)
    {
        return $this->model->findOrFail($id);
    }
}
