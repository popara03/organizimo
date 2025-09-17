<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    protected $fillable = [
        'title',
        'content',
        'group_id',
        'user_id',
        'status',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function savedByUsers() : BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_post_saved');
    }

    public function followedByUsers() : BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_post_following');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
