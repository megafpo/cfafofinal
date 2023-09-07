<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeliveryTimeSlotAvailabilitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('delivery_time_slot_availabilities', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('delivery_date')->nullable();
            $table->string('delivery_timeslot')->nullable();
            $table->string('unavailable')->nullable();
            $table->string('restaurant_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('delivery_time_slot_availabilities');
    }
}
