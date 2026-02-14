<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'office_id',
        'created_by',
        'name',
        'contract_type',
        'description',
        'status',
         'content', 
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ✅ أضف هذه العلاقة
    public function fields()
    {
        return $this->hasMany(TemplateField::class)->orderBy('sort_order');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForOffice($query, $officeId)
    {
        return $query->where('office_id', $officeId);
    }
}