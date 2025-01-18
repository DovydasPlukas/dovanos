<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image_url',
        'vendor_id',
        'product_url',
    ];
    
    // connect to the vendor table
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function wishlistUsers()
    {
        return $this->belongsToMany(User::class, 'wishlist');
    }

    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'item_attributes');
    }
}