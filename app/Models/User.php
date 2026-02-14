<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles; // إذا كنت ستستخدم Spatie

class User extends Authenticatable
{
    use Notifiable, HasUuids;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'office_id',
        'phone',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => 'string',
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
        return $this->hasMany(Contract::class, 'created_by');
    }

    public function templates()
    {
        return $this->hasMany(Template::class, 'created_by');
    }
}