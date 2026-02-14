<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateField extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'template_id',
        'label',
        'key',
        'type',
        'source',
        'is_required',
        'client_role',
        'client_field',
        'system_value',
        'options',
        'sort_order',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_required' => 'boolean',
        'options' => 'array',
        'sort_order' => 'integer',
        'type' => 'string',
        'source' => 'string',
        'client_role' => 'string',
    ];

    /**
     * العلاقة مع القالب
     */
    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * هل هذا الحقل من نوع client؟
     */
    public function isClientField(): bool
    {
        return $this->source === 'client';
    }

    /**
     * هل هذا الحقل من نوع system؟
     */
    public function isSystemField(): bool
    {
        return $this->source === 'system';
    }

    /**
     * هل هذا الحقل من نوع manual؟
     */
    public function isManualField(): bool
    {
        return $this->source === 'manual';
    }

    /**
     * الحصول على قيمة افتراضية للنظام
     */
    public function getSystemDefaultValue()
    {
        if (!$this->isSystemField()) {
            return null;
        }

        return match($this->system_value) {
            'today' => now()->format('Y-m-d'),
            'now' => now()->format('Y-m-d H:i:s'),
            'contract_number' => '[سيتم إنشاؤه تلقائياً]',
            'office_name' => optional($this->template?->office)->name,
            'office_id' => optional($this->template?->office)->id,
            'current_user_name' => optional(auth()->user())->name,
            'current_user_id' => auth()->id(),
            default => $this->system_value,
        };
    }

    /**
     * التحقق من صحة الحقل حسب نوعه
     */
    public function validateValue($value): bool
    {
        if ($this->is_required && empty($value)) {
            return false;
        }

        return match($this->type) {
            'number' => is_numeric($value),
            'date' => strtotime($value) !== false,
            'select' => in_array($value, array_column($this->options ?? [], 'value')),
            default => true,
        };
    }

    /**
     * Scope للحصول على حقول من نوع معين
     */
    public function scopeOfSource($query, $source)
    {
        return $query->where('source', $source);
    }

    /**
     * Scope للحصول على الحقول الإجبارية
     */
    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    /**
     * Scope للحصول على حقول client محددة الدور
     */
    public function scopeForClientRole($query, $role)
    {
        return $query->where('source', 'client')
                     ->where('client_role', $role);
    }
}