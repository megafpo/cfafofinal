<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatefrutriNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('frutri_news', function (Blueprint $table) {
            $table->increments('id');
            $table->string('news_id');
            $table->text('title');
            $table->longText('content')->nullable();
            $table->text('image')->nullable();
            $table->text('link')->nullable();
            $table->boolean('is_read')->default(0);
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
        Schema::dropIfExists('frutri_news');
    }
}
