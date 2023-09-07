<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    public function restaurants()
    {
        return $this->hasMany('App\Restaurant');
    }
}
