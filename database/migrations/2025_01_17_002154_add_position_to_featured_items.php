<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\FeaturedItem;

return new class extends Migration
{
    public function up()
    {
        Schema::table('featured_items', function (Blueprint $table) {
            $table->integer('position')->nullable();
        });

        // Assign positions to existing items
        $items = FeaturedItem::orderBy('id')->get();
        foreach ($items as $index => $item) {
            $item->position = $index;
            $item->save();
        }

        // Make position required after setting initial values
        Schema::table('featured_items', function (Blueprint $table) {
            $table->integer('position')->nullable(false)->change();
        });
    }

    public function down()
    {
        Schema::table('featured_items', function (Blueprint $table) {
            $table->dropColumn('position');
        });
    }
};
