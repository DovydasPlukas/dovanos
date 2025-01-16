<?php

namespace App\Providers;

use App\Repositories\Interfaces\ItemRepositoryInterface;
use App\Repositories\Interfaces\VendorRepositoryInterface;
use App\Repositories\Interfaces\FeaturedItemRepositoryInterface;
use App\Repositories\Interfaces\WishlistRepositoryInterface;
use App\Repositories\ItemRepository;
use App\Repositories\VendorRepository;
use App\Repositories\FeaturedItemRepository;
use App\Repositories\WishlistRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(ItemRepositoryInterface::class, ItemRepository::class);
        $this->app->bind(VendorRepositoryInterface::class, VendorRepository::class);
        $this->app->bind(FeaturedItemRepositoryInterface::class, FeaturedItemRepository::class);
        $this->app->bind(WishlistRepositoryInterface::class, WishlistRepository::class);
    }
}
