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
   ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

   public function users() : BelongsToMany
   {
       return $this->belongsToMany(User::class);
   }
}