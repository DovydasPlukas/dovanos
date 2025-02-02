<?php

namespace App\Providers;

use App\Repositories\Interfaces\ItemRepositoryInterface;
use App\Repositories\Interfaces\VendorRepositoryInterface;
use App\Repositories\Interfaces\FeaturedItemRepositoryInterface;
use App\Repositories\Interfaces\WishlistRepositoryInterface;
use App\Repositories\Interfaces\AttributeRepositoryInterface;
use App\Repositories\Interfaces\AttributeGroupRepositoryInterface;
use App\Repositories\ItemRepository;
use App\Repositories\VendorRepository;
use App\Repositories\FeaturedItemRepository;
use App\Repositories\WishlistRepository;
use App\Repositories\AttributeRepository;
use App\Repositories\AttributeGroupRepository;
use App\Repositories\ItemAttributeRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(ItemRepositoryInterface::class, ItemRepository::class);
        $this->app->bind(VendorRepositoryInterface::class, VendorRepository::class);
        $this->app->bind(FeaturedItemRepositoryInterface::class, FeaturedItemRepository::class);
        $this->app->bind(WishlistRepositoryInterface::class, WishlistRepository::class);
        $this->app->bind(AttributeRepositoryInterface::class, AttributeRepository::class);
        $this->app->bind(AttributeGroupRepositoryInterface::class, AttributeGroupRepository::class);
        $this->app->bind(ItemAttributeRepository::class, ItemAttributeRepository::class);
    }
}
