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
        Schema::create('templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // المفاتيح الأجنبية
            $table->uuid('office_id');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');

            
            // الحقول الأساسية
            $table->string('name');
            $table->longText('content');  // النص مع placeholders
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index('name');
            $table->index('is_active');
            $table->index(['office_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};