<?php

namespace Database\Seeders;

use App\Models\NotificationType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $TYPES = [
            'general',
            'post_status_change',
            'post_comment',
            'comment_reply',
        ];

        foreach($TYPES as $t){
            NotificationType::create(["name" => $t]);
        }
    }
}