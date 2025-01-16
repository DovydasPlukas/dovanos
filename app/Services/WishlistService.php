<?php

namespace App\Services;

use App\Repositories\Interfaces\WishlistRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class WishlistService
{
    protected $wishlistRepository;

    public function __construct(WishlistRepositoryInterface $wishlistRepository)
    {
        $this->wishlistRepository = $wishlistRepository;
    }

    public function getWishlistItems()
    {
        return $this->wishlistRepository->getWishlistItems(Auth::id());
    }

    public function toggleWishlistItem($itemId)
    {
        $userId = Auth::id();
        $wishlist = $this->wishlistRepository->findWishlistItem($userId, $itemId);

        if ($wishlist) {
            $this->wishlistRepository->deleteWishlistItem($wishlist);
            return ['inWishlist' => false];
        }

        $this->wishlistRepository->createWishlistItem($userId, $itemId);
        return ['inWishlist' => true];
    }

    public function checkWishlistItem($itemId)
    {
        return [
            'inWishlist' => $this->wishlistRepository->checkWishlistItem(Auth::id(), $itemId)
        ];
    }
}
