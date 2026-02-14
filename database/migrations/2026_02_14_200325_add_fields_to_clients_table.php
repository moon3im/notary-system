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
        Schema::table('clients', function (Blueprint $table) {
            // إضافة الحقول الجديدة (إذا لم تكن موجودة)
            if (!Schema::hasColumn('clients', 'nationality')) {
                $table->string('nationality')
                      ->default('جزائري')
                      ->after('phone')
                      ->comment('الجنسية');
            }

            if (!Schema::hasColumn('clients', 'profession')) {
                $table->string('profession')
                      ->nullable()
                      ->after('nationality')
                      ->comment('المهنة');
            }

            if (!Schema::hasColumn('clients', 'birth_certificate')) {
                $table->string('birth_certificate')
                      ->nullable()
                      ->after('birth_place')
                      ->comment('رقم شهادة الميلاد');
            }

            if (!Schema::hasColumn('clients', 'id_issue_date')) {
                $table->date('id_issue_date')
                      ->nullable()
                      ->after('national_id')
                      ->comment('تاريخ إصدار بطاقة التعريف');
            }

            if (!Schema::hasColumn('clients', 'id_issuing_authority')) {
                $table->string('id_issuing_authority')
                      ->nullable()
                      ->after('id_issue_date')
                      ->comment('جهة إصدار بطاقة التعريف');
            }

            // إضافة full_name المحسوب (اختياري - إذا أردت)
            if (!Schema::hasColumn('clients', 'full_name')) {
                $table->string('full_name')
                      ->nullable()
                      ->after('last_name')
                      ->comment('الاسم الكامل (محسوب)');
            }
        });

        // تحديث full_name للبيانات الموجودة
        if (Schema::hasColumn('clients', 'full_name')) {
            DB::statement("
                UPDATE clients 
                SET full_name = CONCAT(
                    first_name, 
                    COALESCE(CONCAT(' ', father_name), ''), 
                    ' ', 
                    last_name
                )
                WHERE full_name IS NULL OR full_name = ''
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $columns = [
                'nationality',
                'profession',
                'birth_certificate',
                'id_issue_date',
                'id_issuing_authority',
                'full_name'
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('clients', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};