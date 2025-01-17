<?php

namespace App\Console\Commands;

use App\Models\FeaturedItem;
use Illuminate\Console\Command;

class ResetFeaturedItemsPositions extends Command
{
    protected $signature = 'featured-items:reset-positions';
    protected $description = 'Reset positions for all featured items';

    public function handle()
    {
        $items = FeaturedItem::orderBy('id')->get();
        foreach ($items as $index => $item) {
            $item->position = $index;
            $item->save();
        }
        $this->info('Featured items positions have been reset successfully.');
    }
}
