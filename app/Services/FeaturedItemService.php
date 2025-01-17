<?php

namespace App\Services;

use App\Repositories\Interfaces\FeaturedItemRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class FeaturedItemService
{
    protected $featuredItemRepository;

    public function __construct(FeaturedItemRepositoryInterface $featuredItemRepository)
    {
        $this->featuredItemRepository = $featuredItemRepository;
    }

    public function getAllFeaturedItems()
    {
        return $this->featuredItemRepository->getAllWithItems();
    }

    public function createFeaturedItem(array $data)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        if ($this->featuredItemRepository->count() >= 5) {
            throw new \Exception('Maximum number of featured items reached', 422);
        }

        return $this->featuredItemRepository->create($data);
    }

    public function deleteFeaturedItem($id)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        return $this->featuredItemRepository->delete($id);
    }

    public function reorderFeaturedItem(array $data)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        $featuredItem = $this->featuredItemRepository->findOrFail($data['id']);
        $items = $this->featuredItemRepository->getAllOrderedByPosition();
        
        $currentIndex = $items->search(function($item) use ($featuredItem) {
            return $item->id === $featuredItem->id;
        });

        if ($data['direction'] === 'up' && $currentIndex > 0) {
            $swapItem = $items[$currentIndex - 1];
        } elseif ($data['direction'] === 'down' && $currentIndex < $items->count() - 1) {
            $swapItem = $items[$currentIndex + 1];
        } else {
            throw new \Exception('Cannot move item in that direction', 422);
        }

        return $this->featuredItemRepository->swapPositions($featuredItem, $swapItem);
    }
}
