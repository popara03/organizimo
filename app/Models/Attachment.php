<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attachment extends Model
{
    protected $fillable = ['name', 'type', 'path'];

    public function post() : BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
