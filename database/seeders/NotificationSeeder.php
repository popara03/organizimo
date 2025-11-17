<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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