<?php

namespace App\Models;

use Dom\Comment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Notification extends Model
{
    protected $fillable = [
        'type_id',
        'post_id',
        'comment_id',
        'action_author_id',
        'message',
    ];

    public function type() : BelongsTo {
        return $this->belongsTo(NotificationType::class, 'type_id');
    }

    public function post() : BelongsTo {
        return $this->belongsTo(Post::class);
    }

    public function comment() : BelongsTo {
        return $this->belongsTo(Comment::class);
    }

    public function actionAuthor() : belongsTo {
        return $this->belongsTo(User::class, 'action_author_id');
    }

    public function usersNotified() : BelongsToMany {
        return $this->belongsToMany(User::class)->withPivot('is_read')->withTimestamps();
    }
}