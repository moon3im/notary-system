<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // أولاً: تفعيل extension uuid-ossp في PostgreSQL
        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // ثانياً: حذف المفاتيح الأجنبية
        Schema::table('templates', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['voided_by']);
        });

        // ثالثاً: تغيير users.id إلى UUID
        DB::statement('ALTER TABLE users ALTER COLUMN id DROP DEFAULT;');
        DB::statement('DROP SEQUENCE IF EXISTS users_id_seq CASCADE;');
        
        // استخدام gen_random_uuid() بدلاً من uuid_generate_v4()
        DB::statement('ALTER TABLE users ALTER COLUMN id TYPE uuid USING (gen_random_uuid());');
        DB::statement('ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();');

        // رابعاً: تغيير created_by في templates
        DB::statement('ALTER TABLE templates ALTER COLUMN created_by TYPE uuid USING (gen_random_uuid());');
        
        // خامساً: تغيير created_by و voided_by في contracts
        DB::statement('ALTER TABLE contracts ALTER COLUMN created_by TYPE uuid USING (gen_random_uuid());');
        DB::statement('ALTER TABLE contracts ALTER COLUMN voided_by TYPE uuid USING (gen_random_uuid());');

        // سادساً: إعادة المفاتيح الأجنبية
        Schema::table('templates', function (Blueprint $table) {
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('voided_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        // صعب الرجوع، نتركه فارغاً
    }
};