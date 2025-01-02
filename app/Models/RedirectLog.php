<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RedirectLog extends Model
{
        protected $fillable = [
            'item_id',
            'timestamp',
            'ip_address',
            'user_agent',
            'referrer',
            'unique_hash',
        ];
        protected $table = 'redirect_logs';
}
