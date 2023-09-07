<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RestaurantPayout extends Model
{
    public static function boot()
    {
        parent::boot();
        static::addGlobalScope(new \App\Scopes\ZoneScope);
    }
    /**
     * @return mixed
     */
    public function restaurant()
    {
        return $this->belongsTo('App\Restaurant');
    }
}
