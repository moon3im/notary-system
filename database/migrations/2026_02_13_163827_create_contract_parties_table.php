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
        Schema::create('contract_parties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // المفاتيح الأجنبية
            $table->uuid('contract_id');
            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            
            $table->uuid('client_id');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            
            // دور الطرف في العقد
            $table->enum('role', ['seller', 'buyer', 'other'])->default('other');
            
            $table->timestamps();
            
            // Indexes للبحث السريع
            $table->index('role');
            $table->index(['contract_id', 'role']);
            $table->index(['client_id', 'role']);
            
            // منع تكرار نفس العميل في نفس الدور لنفس العقد
            $table->unique(['contract_id', 'client_id', 'role'], 'contract_party_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_parties');
    }
};