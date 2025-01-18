<?php

namespace App\Services;

use App\Repositories\Interfaces\ItemRepositoryInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Item;

class ItemService
{
    protected $itemRepository;

    public function __construct(ItemRepositoryInterface $itemRepository)
    {
        $this->itemRepository = $itemRepository;
    }

    public function getAllItems()
    {
        $items = $this->itemRepository->getAllItems();
        return $items->map(function ($item) {
            $itemData = $item->toArray();
            $itemData['occasion'] = $item->attributes->pluck('name')->toArray();
            return $itemData;
        });
    }

    public function getItem($id)
    {
        return $this->itemRepository->getItemById($id);
    }

    public function createItem(array $data)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        if (isset($data['image_file'])) {
            $data['image_url'] = $this->handleImageUpload($data['image_file']);
        }

        return $this->itemRepository->createItem($data);
    }

    public function updateItem($id, array $data)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        $item = $this->itemRepository->getItemById($id);

        if (isset($data['image_file'])) {
            $this->deleteOldImage($item->image_url);
            $data['image_url'] = $this->handleImageUpload($data['image_file']);
        }

        return $this->itemRepository->updateItem($id, $data);
    }

    public function deleteItem($id)
    {
        if (!Auth::user()?->is_admin) {
            throw new \Exception('Unauthorized', 403);
        }

        $item = $this->itemRepository->getItemById($id);
        $this->deleteOldImage($item->image_url);
        
        return $this->itemRepository->deleteItem($id);
    }

    public function searchItems($query)
    {
        return $this->itemRepository->searchItems($query);
    }

    protected function handleImageUpload($image)
    {
        $path = $image->store('images', 'public');
        return 'storage/' . $path;
    }

    protected function deleteOldImage($imageUrl)
    {
        if ($imageUrl && !filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete(str_replace('storage/', '', $imageUrl));
        }
    }
}
