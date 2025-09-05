<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
   protected $fillable = [
       'id',  
       'name',
   ];

   protected $hidden = [
       'created_at',
       'updated_at',
   ];

   public function users()
   {
       return $this->hasMany(User::class);
   }
}