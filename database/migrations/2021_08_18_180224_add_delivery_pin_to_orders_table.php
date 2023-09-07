<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDeliveryPinToOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //drop delivery_pin from users table if exits...
        if (Schema::hasColumn('users', 'delivery_pin')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('delivery_pin');
            });
        }

        //add delivery_pin to orders tabel
        Schema::table('orders', function (Blueprint $table) {
            $table->string('delivery_pin')->default('123456')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            //
        });
    }
}
