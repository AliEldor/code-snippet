<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('snippet_tag', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('snippet_id');
            $table->unsignedBigInteger('tag_id');
            $table->timestamps();

            //foreign key constraints
            $table->foreign('snippet_id')->references('id')->on('snippets')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('snippet_tag');
    }
};
