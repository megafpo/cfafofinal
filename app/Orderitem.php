<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Orderitem extends Model
{
    /**
     * @return mixed
     */
    public function order()
    {
        return $this->belongsTo('App\Order');
    }

    /**
     * @return mixed
     */
    public function order_item_addons()
    {
        return $this->hasMany('App\OrderItemAddon');
    }

    /**
     * @return mixed
     */
    public function item()
    {
        return $this->belongsTo('App\Item');
    }
}
