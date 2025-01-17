<?php

namespace App\Repositories;

use App\Models\FeaturedItem;
use App\Repositories\Interfaces\FeaturedItemRepositoryInterface;
use Illuminate\Support\Facades\DB;

class FeaturedItemRepository implements FeaturedItemRepositoryInterface
{
    protected $model;

    public function __construct(FeaturedItem $model)
    {
        $this->model = $model;
    }

    public function getAllWithItems()
    {
        return $this->model->with(['item.vendor'])
            ->orderBy('position')
            ->get()
            ->map(function ($featuredItem) {
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
                    'position' => $featuredItem->position,
                ];
            });
    }

    public function create(array $data)
    {
        $lastPosition = $this->model->max('position');
        $data['position'] = $lastPosition !== null ? $lastPosition + 1 : 0;
        return $this->model->create($data);
    }

    public function delete($id)
    {
        $item = $this->model->findOrFail($id);
        $position = $item->position;

        // Update positions of items after the deleted one
        $this->model->where('position', '>', $position)
            ->decrement('position');

        return $item->delete();
    }

    public function count()
    {
        return $this->model->count();
    }

    public function findOrFail($id)
    {
        return $this->model->findOrFail($id);
    }

    public function getAllOrderedByPosition()
    {
        return $this->model->orderBy('position')->get();
    }

    public function swapPositions(FeaturedItem $item1, FeaturedItem $item2)
    {
        return DB::transaction(function () use ($item1, $item2) {
            $tempPosition = $item1->position;
            $item1->position = $item2->position;
            $item2->position = $tempPosition;

            $item1->save();
            $item2->save();

            return true;
        });
    }
}
