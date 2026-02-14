<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
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
        'template_id',
        'contract_number',
        'contract_type',
        'content_snapshot',
        'data_snapshot',
        'pdf_path',
        'pdf_hash',
        'status',
        'void_reason',
        'voided_by',
        'voided_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'data_snapshot' => 'array',
        'voided_at' => 'datetime',
        'status' => 'string',
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

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function parties()
    {
        return $this->hasMany(ContractParty::class);
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'contract_parties')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function voidedBy()
    {
        return $this->belongsTo(User::class, 'voided_by');
    }

    /**
     * التحقق من صحة العقد (لم يتم العبث بالـ PDF)
     */
    public function verifyPdfHash(string $pdfContent): bool
    {
        return hash('sha256', $pdfContent) === $this->pdf_hash;
    }

    /**
     * إبطال العقد
     */
    public function void(string $reason, User $user): bool
    {
        return $this->update([
            'status' => 'void',
            'void_reason' => $reason,
            'voided_by' => $user->id,
            'voided_at' => now(),
        ]);
    }

    /**
     * Scope للعقود النشطة
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope للعقود الملغاة
     */
    public function scopeVoid($query)
    {
        return $query->where('status', 'void');
    }

    /**
     * Scope للبحث في العقود
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('contract_number', 'ilike', "%{$search}%")
              ->orWhere('contract_type', 'ilike', "%{$search}%")
              ->orWhere('content_snapshot', 'ilike', "%{$search}%")
              ->orWhereRaw("data_snapshot->>'seller_name' ilike ?", ["%{$search}%"])
              ->orWhereRaw("data_snapshot->>'buyer_name' ilike ?", ["%{$search}%"]);
        });
    }

    /**
     * الحصول على البائع من data_snapshot
     */
    public function getSellerAttribute()
    {
        return $this->data_snapshot['seller'] ?? null;
    }

    /**
     * الحصول على المشتري من data_snapshot
     */
    public function getBuyerAttribute()
    {
        return $this->data_snapshot['buyer'] ?? null;
    }

    /**
     * تاريخ العقد بصيغة مقروءة
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('Y/m/d');
    }

    // في app/Models/Contract.php، تأكد من وجود:





// دوال مساعدة للوصول السريع للأطراف
public function getSellersAttribute()
{
    return $this->parties()->where('role', 'seller')->get();
}

public function getBuyersAttribute()
{
    return $this->parties()->where('role', 'buyer')->get();
}
}