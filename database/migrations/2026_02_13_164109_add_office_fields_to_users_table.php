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
        Schema::table('users', function (Blueprint $table) {
            // إضافة office_id كـ foreign key
            $table->uuid('office_id')->nullable()->after('id');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            
            // إضافة الحقول الجديدة
            $table->string('phone')->nullable()->after('email');
            $table->enum('role', ['notary', 'assistant'])->default('assistant')->after('phone');
            
            // إضافة Indexes
            $table->index('role');
            $table->index('office_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // حذف المفاتيح الأجنبية أولاً
            $table->dropForeign(['office_id']);
            
            // حذف الأعمدة
            $table->dropColumn(['office_id', 'phone', 'role']);
        });
    }
};