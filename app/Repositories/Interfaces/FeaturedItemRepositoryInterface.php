<?php

namespace App\Repositories\Interfaces;

use App\Models\FeaturedItem;

interface FeaturedItemRepositoryInterface
{
    public function getAllWithItems();
    public function create(array $data);
    public function delete($id);
    public function count();
    public function findOrFail($id);
    public function getAllOrderedByPosition();
    public function swapPositions(FeaturedItem $item1, FeaturedItem $item2);
}
