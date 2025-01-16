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
}
