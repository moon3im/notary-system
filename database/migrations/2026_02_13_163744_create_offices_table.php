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
        Schema::create('offices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->enum('subscription_status', ['inactive', 'active', 'suspended'])->default('inactive');
            $table->timestamps();
            
            // إضافة Indexes للبحث السريع
            $table->index('subscription_status');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offices');
    }
};