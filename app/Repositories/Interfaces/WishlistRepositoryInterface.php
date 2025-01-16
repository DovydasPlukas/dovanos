<?php

namespace App\Repositories\Interfaces;

interface WishlistRepositoryInterface
{
    public function getWishlistItems($userId);
    public function findWishlistItem($userId, $itemId);
    public function checkWishlistItem($userId, $itemId);
    public function createWishlistItem($userId, $itemId);
    public function deleteWishlistItem($wishlist);
}
