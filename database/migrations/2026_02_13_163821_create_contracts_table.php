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
        Schema::create('contracts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // المفاتيح الأجنبية الأساسية
            $table->uuid('office_id');
            $table->foreign('office_id')->references('id')->on('offices')->onDelete('cascade');
            
           $table->foreignId('created_by')->constrained('users')->onDelete('cascade');

            
            $table->uuid('template_id')->nullable();
            $table->foreign('template_id')->references('id')->on('templates')->onDelete('set null');
            
            // معلومات العقد الأساسية
            $table->string('contract_number')->unique(); // رقم العقد الفريد
            $table->string('contract_type'); // نوع العقد (بيع، كراء، هبة، ...)
            
            // الـ Snapshots (القلب القانوني)
            $table->longText('content_snapshot'); // النص النهائي بعد الدمج
            $table->jsonb('data_snapshot'); // بيانات الزبائن وقت الإنشاء بصيغة JSON
            
            // ملف PDF
            $table->string('pdf_path'); // المسار في storage
            $table->string('pdf_hash', 64); // SHA256 للتحقق
            
            // الحالة القانونية
            $table->enum('status', ['active', 'void'])->default('active');
            $table->text('void_reason')->nullable();
            $table->foreignId('voided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('voided_at')->nullable();
            
            $table->timestamps();
            
            // Indexes للبحث السريع
            $table->index('contract_number');
            $table->index('contract_type');
            $table->index('status');
            $table->index('created_at');
            $table->index(['office_id', 'status', 'created_at']);
            $table->index(['template_id', 'status']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};