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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();                                       // id (primary key)
            $table->string('name', 255);                        // Pardavėjo pavadinimas
            $table->text('contact_details')->nullable();        // Kontaktiniai duomenys
            $table->string('website', 255);                     // Pardavėjo svetainės URL
            $table->timestamps();                               // created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
