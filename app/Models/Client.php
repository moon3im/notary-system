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
        'national_id',
        'id_card_number',
        'birth_date',
        'birth_place',
        'marital_status',
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
        'marital_status' => 'string',
    ];

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

    /**
     * Accessor للاسم الكامل
     */
    public function getFullNameAttribute(): string
    {
        $name = $this->first_name . ' ' . $this->last_name;
        
        if ($this->father_name) {
            $name .= ' بن ' . $this->father_name;
        }
        
        return $name;
    }

    /**
     * Scope للبحث
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('first_name', 'ilike', "%{$search}%")
              ->orWhere('last_name', 'ilike', "%{$search}%")
              ->orWhere('father_name', 'ilike', "%{$search}%")
              ->orWhere('national_id', 'ilike', "%{$search}%")
              ->orWhere('phone', 'ilike', "%{$search}%");
        });
    }

    /**
     * Scope لعملاء مكتب معين
     */
    public function scopeForOffice($query, $officeId)
    {
        return $query->where('office_id', $officeId);
    }
    // في app/Models/Client.php، تأكد من وجود:

public function contractParties()
{
    return $this->hasMany(ContractParty::class);
}
}