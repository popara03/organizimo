<?php

namespace App\Models;

use App\Models\Group;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    //ono sto se moze insertovati, sprecava zloupotrebe unosa
    protected $fillable = [
        'name',
        'email',
        'password',
        'image',
        'position',
        'role_id'
    ];

    //ono sto se nece vracati u response-u kad se vrati kao JSON/Array, ne vazi u tvom PHP kodu vec samo ako se koristi kao API
    protected $hidden = [
        'email',
        'email_verified_at',
        'password',
        'remember_token',
    ];

    // za definisanje konverzija podataka tabele u odredjeni tip
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role() : BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function groups() : BelongsToMany{
        return $this->belongsToMany(Group::class);
    }
}