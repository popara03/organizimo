<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
   protected $fillable = [
       'id',
       'name',
       'color',
       'is_ffa',
       'users',
   ];

    protected $hidden = [
        'updated_at',
    ];

    protected $casts = [
        'is_ffa' => 'boolean',
    ];

   public function users() : BelongsToMany
   {
       return $this->belongsToMany(User::class);
   }
}