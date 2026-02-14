<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
        'phone',
        'subscription_status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subscription_status' => 'string',
    ];

    /**
     * العلاقات (سنضيفها لاحقاً)
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function templates()
    {
        return $this->hasMany(Template::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    // في app/Models/Office.php أضف:


            public function activeSubscription()
            {
                return $this->hasOne(Subscription::class)
                ->where('status', 'active')
                ->where('started_at', '<=', now())
                ->where(function($q) {
                    $q->whereNull('ended_at')
                      ->orWhere('ended_at', '>', now());
                })
                ->latest();
            }
}