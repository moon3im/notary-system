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
        Schema::create('clients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // المفاتيح الأجنبية
            $table->uuid('office_id');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            
            // المعلومات الشخصية
            $table->string('first_name');
            $table->string('last_name');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            
            // وثائق الهوية
            $table->string('national_id')->unique(); // رقم التعريف الوطني (فريد)
            $table->string('id_card_number')->nullable(); // رقم بطاقة التعريف
            $table->date('birth_date')->nullable();
            $table->string('birth_place')->nullable();
            
            // معلومات إضافية
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            
            $table->timestamps();
            
            // Indexes للبحث السريع
            $table->index('first_name');
            $table->index('last_name');
            $table->index('national_id');
            $table->index('phone');
            $table->index(['office_id', 'last_name', 'first_name']);
            $table->index('birth_date');
            
            // Full text search للبحث بالعربية (PostgreSQL)
            $table->fullText(['first_name', 'last_name', 'father_name', 'national_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};