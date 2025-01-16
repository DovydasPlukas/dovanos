<?php

namespace App\Repositories\Interfaces;

interface FeaturedItemRepositoryInterface
{
    public function getAllWithItems();
    public function create(array $data);
    public function delete($id);
    public function count();
    public function findOrFail($id);
}
