<?php

namespace App\Repositories;

use App\Models\Wishlist;
use App\Repositories\Interfaces\WishlistRepositoryInterface;

class WishlistRepository implements WishlistRepositoryInterface
{
    protected $model;

    public function __construct(Wishlist $model)
    {
        $this->model = $model;
    }

    public function getWishlistItems($userId)
    {
        return $this->model->where('user_id', $userId)
            ->with('item')
            ->get()
            ->map(function ($wishlist) {
                return $wishlist->item;
            });
    }

    public function findWishlistItem($userId, $itemId)
    {
        return $this->model->where('user_id', $userId)
            ->where('item_id', $itemId)
            ->first();
    }

    public function checkWishlistItem($userId, $itemId)
    {
        return $this->model->where('user_id', $userId)
            ->where('item_id', $itemId)
            ->exists();
    }

    public function createWishlistItem($userId, $itemId)
    {
        return $this->model->create([
            'user_id' => $userId,
            'item_id' => $itemId
        ]);
    }

    public function deleteWishlistItem($wishlist)
    {
        return $wishlist->delete();
    }
}
