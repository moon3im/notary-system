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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('office_id');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            
            $table->enum('plan_type', ['monthly', 'yearly']);
            $table->enum('status', ['active', 'expired', 'cancelled', 'suspended'])->default('active');
            
            $table->datetime('started_at');
            $table->datetime('ended_at')->nullable();
            
            $table->boolean('auto_renew')->default(false);
            $table->string('payment_reference')->nullable();
            
            $table->timestamps();
            
            // Indexes للبحث السريع
            $table->index('status');
            $table->index(['office_id', 'status']);
            $table->index('started_at');
            $table->index('ended_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};