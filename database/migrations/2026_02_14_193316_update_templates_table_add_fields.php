<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            // إضافة الحقول الجديدة (إذا لم تكن موجودة)
            if (!Schema::hasColumn('templates', 'contract_type')) {
                $table->string('contract_type')->after('name')->nullable();
            }
            
            if (!Schema::hasColumn('templates', 'description')) {
                $table->text('description')->after('contract_type')->nullable();
            }
            
            if (!Schema::hasColumn('templates', 'status')) {
                $table->enum('status', ['draft', 'active'])->after('description')->default('draft');
            }
            
            if (!Schema::hasColumn('templates', 'body')) {
                $table->longText('body')->after('status')->nullable();
            }
            
            // تعديل العمود created_by ليكون uuid (إذا كان foreignId)
            if (Schema::hasColumn('templates', 'created_by')) {
                // لا تغيير - هو بالفعل uuid
            }
        });
    }

    public function down(): void
    {
        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn(['contract_type', 'description', 'status', 'body']);
        });
    }
};