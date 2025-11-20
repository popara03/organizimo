<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Notification;
use App\Models\NotificationType;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // add notifications for the admin user (id 1)
        $admin = User::find(1);

        $random_post_in_admin_group = $admin->groups()->inRandomOrder()->first()?->posts()->inRandomOrder()->first();
        $random_user_in_admin_group = $random_post_in_admin_group->group->users()->inRandomOrder()->first();
        
        $admin->followingPosts()->attach($random_post_in_admin_group->id); // follow the post
        
        $comment = Comment::create([
            "post_id" => $random_post_in_admin_group->id,
            "user_id" => $random_user_in_admin_group->id,
            "content" => "This is a notification test comment!"
        ]); //new comment

        $comment_notification = Notification::create([
            'type_id' => NotificationType::where('name', "post_comment")->first()->id,
            'post_id' => $random_post_in_admin_group->id,
            'comment_id' => $comment->id,
            'user_id' => $random_user_in_admin_group->id,
        ]);
        $admin->notifications()->attach($comment_notification->id); // add notfication to the user

        // status change notification
        $notification = Notification::create([
            'type_id' => NotificationType::where('name', "post_status_change")->first()->id,
            'post_id' => $random_post_in_admin_group->id,
            'user_id' => $random_post_in_admin_group->user->id,
        ]);
        $admin->notifications()->attach($notification->id); // add notfication to the user

        // insert welcome notification for all users
        $welcome = Notification::create([
            'type_id' => 1,
            'message' => 'Welcome to Organizimo! We are glad to have you here.',
        ]);

        $users = User::all();
            foreach($users as $user){
                $user->notifications()->attach($welcome->id, ['is_read' => false]);
        }
    }
}