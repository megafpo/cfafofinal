<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PopularGeoPlace extends Model
{

    /**
     * @var array
     */
    protected $casts = [
        'is_active' => 'integer',
        'is_default' => 'integer',
    ];

    /**
     * @return mixed
     */
    public function toggleActive()
    {
        $this->is_active = !$this->is_active;
        return $this;
    }
}
