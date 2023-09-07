<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AddonCategory extends Model
{

    /**
     * @var array
     */
    protected $casts = [
        'addon_limit' => 'integer',
    ];

    /**
     * @return mixed
     */
    public function items()
    {
        return $this->belongsToMany(Item::class);
    }

    /**
     * @return mixed
     */
    public function addons()
    {
        return $this->hasMany('App\Addon');
    }
}
