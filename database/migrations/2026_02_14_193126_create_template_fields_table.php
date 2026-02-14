<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_fields', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            $table->uuid('template_id');
            $table->foreign('template_id')->references('id')->on('templates')->onDelete('cascade');
            
            // معلومات الحقل
            $table->string('label'); // اسم البائع
            $table->string('key');   // seller_name
            $table->enum('type', ['text', 'number', 'date', 'select', 'textarea'])->default('text');
            $table->enum('source', ['manual', 'client', 'system'])->default('manual');
            $table->boolean('is_required')->default(false);
            
            // إذا كان المصدر client
            $table->enum('client_role', ['seller', 'buyer', 'other'])->nullable();
            $table->string('client_field')->nullable(); // full_name, birth_date, national_id
            
            // إذا كان المصدر system
            $table->string('system_value')->nullable(); // today, contract_number, office_name
            
            // خيارات للحقل من نوع select
            $table->json('options')->nullable();
            
            // ترتيب الحقل
            $table->integer('sort_order')->default(0);
            
            $table->timestamps();
            
            // Indexes
            $table->index(['template_id', 'key']);
            $table->index('source');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_fields');
    }
};