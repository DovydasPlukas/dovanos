<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();                                   // id (primary key)
            $table->string('name', 255);                    // Prekės pavadinimas
            $table->text('description')->nullable();        // Prekės aprašymas
            $table->decimal('price', 10, 2);                // Prekės kaina
            $table->string('image_url', 255)->nullable();   // Nuotraukos URL
            $table->unsignedBigInteger('vendor_id');        // Pardavėjo ID
            $table->string('product_url', 255)->nullable(); // Nuoroda į pardavėjo svetainę
            $table->timestamps();                           // created_at and updated_at

            // Foreign key constraint
            $table->foreign('vendor_id')->references('id')->on('vendors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
