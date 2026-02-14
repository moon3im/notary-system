<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'office_id',
        'created_by',
        'name',
        'content',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * العلاقات
     */
    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * Scope للقوالب النشطة
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope للقوالب الخاصة بمكتب معين
     */
    public function scopeForOffice($query, $officeId)
    {
        return $query->where('office_id', $officeId);
    }
}