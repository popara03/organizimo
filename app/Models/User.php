<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    //ono sto se moze insertovati
    protected $fillable = [
        'name',
        'surname',
        'current_position',
        'email',
        'password',
        'image'
    ];

    //ono sto se nece vracati u response-u kad se pozovu Auth::user() ili User::all
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
