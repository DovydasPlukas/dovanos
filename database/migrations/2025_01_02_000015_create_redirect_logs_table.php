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
        Schema::create('redirect_logs', function (Blueprint $table) {
            $table->id();                                           // id (primary key)
            $table->unsignedBigInteger('item_id');                  // Prekės ID
            $table->timestamp('timestamp')->useCurrent();           // Nukreipimo data ir laikas
            $table->string('ip_address', 45);                       // Vartotojo IP adresas
            $table->text('user_agent')->nullable();                 // Naršyklės informacija
            $table->string('referrer', 255)->nullable();            // Šaltinio URL
            $table->string('unique_hash', 255)->unique();           // Unikalus įrašo hash

            // Foreign key constraint
            $table->foreign('item_id')->references('id')->on('items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('redirect_logs');
    }
};
