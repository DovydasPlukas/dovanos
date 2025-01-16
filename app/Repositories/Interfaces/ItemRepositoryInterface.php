<?php

namespace App\Repositories\Interfaces;

interface ItemRepositoryInterface
{
    public function getAllItems();
    public function getItemById($id);
    public function createItem(array $data);
    public function updateItem($id, array $data);
    public function deleteItem($id);
    public function searchItems($query);
}
