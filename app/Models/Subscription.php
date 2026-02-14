<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'office_id',
        'plan_type',
        'status',
        'started_at',
        'ended_at',
        'auto_renew',
        'payment_reference',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'auto_renew' => 'boolean',
        'plan_type' => 'string',
        'status' => 'string',
    ];

    /**
     * العلاقات
     */
    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    /**
     * Scope للاشتراكات النشطة
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                     ->where('started_at', '<=', now())
                     ->where(function($q) {
                         $q->whereNull('ended_at')
                           ->orWhere('ended_at', '>', now());
                     });
    }

    /**
     * التحقق إذا كان الاشتراك نشط
     */
    public function isValid(): bool
    {
        return $this->status === 'active' 
            && $this->started_at <= now() 
            && ($this->ended_at === null || $this->ended_at > now());
    }
}