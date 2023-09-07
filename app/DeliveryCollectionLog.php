<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeliveryCollectionLog extends Model
{
    public static function boot()
    {
        parent::boot();
        static::addGlobalScope(new \App\Scopes\ZoneScope);
    }

    /**
     * @return mixed
     */
    public function delivery_collection()
    {
        return $this->belongsTo('App\DeliveryCollection');
    }

    public function zone()
    {
        return $this->belongsTo('App\Zone');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
