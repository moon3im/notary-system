<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'office_id',
        'first_name',
        'last_name',
        'father_name',
        'mother_name',
        'full_name', // محسوب
        'national_id',
        'id_card_number',
        'id_issue_date',
        'id_issuing_authority',
        'birth_date',
        'birth_place',
        'birth_certificate',
        'marital_status',
        'nationality',
        'profession',
        'address',
        'phone',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birth_date' => 'date',
        'id_issue_date' => 'date',
        'marital_status' => 'string',
        'nationality' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'birth_date',
        'id_issue_date',
        'created_at',
        'updated_at',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // تحديث full_name تلقائياً قبل الحفظ
        static::saving(function ($client) {
            $client->full_name = $client->generateFullName();
        });
    }

    /**
     * العلاقات
     */
    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function contracts()
    {
        return $this->belongsToMany(Contract::class, 'contract_parties')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function contractParties()
    {
        return $this->hasMany(ContractParty::class);
    }

    /**
     * توليد الاسم الكامل بالتنسيق الجزائري
     * first_name + father_name + last_name
     */
    public function generateFullName(): string
    {
        $name = $this->first_name;
        
        if ($this->father_name) {
            $name .= ' بن ' . $this->father_name;
        }
        
        $name .= ' ' . $this->last_name;
        
        return trim($name);
    }

    /**
     * الحصول على الاسم مع اللقب (first_name + last_name)
     */
    public function getNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * الحصول على الاسم الكامل مع الأم (اختياري)
     */
    public function getFullNameWithMotherAttribute(): string
    {
        $name = $this->first_name . ' ' . $this->last_name;
        
        if ($this->mother_name) {
            $name .= ' بنت ' . $this->mother_name;
        }
        
        return $name;
    }

    /**
     * الحصول على معلومات بطاقة التعريف كاملة
     */
    public function getIdCardInfoAttribute(): array
    {
        return [
            'number' => $this->national_id,
            'card_number' => $this->id_card_number,
            'issue_date' => $this->id_issue_date?->format('Y-m-d'),
            'issuing_authority' => $this->id_issuing_authority,
        ];
    }

    /**
     * الحصول على معلومات الميلاد كاملة
     */
    public function getBirthInfoAttribute(): array
    {
        return [
            'date' => $this->birth_date?->format('Y-m-d'),
            'place' => $this->birth_place,
            'certificate' => $this->birth_certificate,
        ];
    }

    /**
     * هل العميل جزائري؟
     */
    public function isAlgerian(): bool
    {
        return $this->nationality === 'جزائري' || $this->nationality === 'algerian';
    }

    /**
     * نطاقات (Scopes) للبحث
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('first_name', 'ilike', "%{$search}%")
              ->orWhere('last_name', 'ilike', "%{$search}%")
              ->orWhere('father_name', 'ilike', "%{$search}%")
              ->orWhere('full_name', 'ilike', "%{$search}%")
              ->orWhere('national_id', 'ilike', "%{$search}%")
              ->orWhere('phone', 'ilike', "%{$search}%")
              ->orWhere('birth_certificate', 'ilike', "%{$search}%");
        });
    }

    /**
     * نطاق لعملاء مكتب معين
     */
    public function scopeForOffice($query, $officeId)
    {
        return $query->where('office_id', $officeId);
    }

    /**
     * نطاق للتصفية حسب المهنة
     */
    public function scopeOfProfession($query, $profession)
    {
        return $query->where('profession', $profession);
    }

    /**
     * نطاق للتصفية حسب الجنسية
     */
    public function scopeOfNationality($query, $nationality)
    {
        return $query->where('nationality', $nationality);
    }

    /**
     * Accessor للحالة الاجتماعية بصيغة مقروءة
     */
    public function getMaritalStatusLabelAttribute(): string
    {
        return match($this->marital_status) {
            'single' => 'أعزب',
            'married' => 'متزوج',
            'divorced' => 'مطلق',
            'widowed' => 'أرمل',
            default => '-',
        };
    }

    /**
     * Accessor لتاريخ الميلاد بصيغة مقروءة
     */
    public function getBirthDateFormattedAttribute(): string
    {
        return $this->birth_date?->format('d/m/Y') ?: '-';
    }

    /**
     * Accessor لتاريخ إصدار البطاقة بصيغة مقروءة
     */
    public function getIdIssueDateFormattedAttribute(): string
    {
        return $this->id_issue_date?->format('d/m/Y') ?: '-';
    }

    /**
     * Accessor لعمر العميل
     */
    public function getAgeAttribute(): ?int
    {
        return $this->birth_date?->age;
    }

    /**
     * التحقق من اكتمال بيانات العميل
     */
    public function isComplete(): bool
    {
        return !empty($this->first_name) 
            && !empty($this->last_name) 
            && !empty($this->national_id)
            && !empty($this->birth_date)
            && !empty($this->birth_place);
    }

    /**
     * الحصول على ملخص بيانات العميل
     */
    public function getSummaryAttribute(): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'national_id' => $this->national_id,
            'birth_date' => $this->birth_date_formatted,
            'phone' => $this->phone,
            'profession' => $this->profession,
            'nationality' => $this->nationality,
        ];
    }
}