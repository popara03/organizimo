<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for($i = 0; $i < 10; $i++) {
            $user = User::inRandomOrder()->first(); // get a random user
            $group = $user->groups()->inRandomOrder()->first(); // get a random group from that user

            $faker = Faker::create(); // create a Faker instance

            $post = Post::create([
                'title' => $faker->sentence(rand(5, 10)),
                'content' => $faker->paragraph(rand(4, 10)),
                'user_id' => $user->id,
                'group_id' => $group->id ? $group->id : 1,  // if user has no group, assign to General group (id 1)
                'status' => (bool) rand(0, 1)
            ]);

            // optionally add attachments and comments
            if (rand(0, 1)) {
                $post->attachments()->create([
                    'name' => 'placeholder_image_' . rand(1, 500) . '.jpg',
                    'type' => 'image',
                    'path' => 'https://picsum.photos/1280/720',
                ],
                [
                    'name' => 'document_' . rand(1, 500) . '.txt',
                    'type' => 'document',
                    'path' => 'http://www.w3.org/TR/html4/strict.dtd',
                ]);

                //add one single comment
                $post->comments()->create([
                    'content' => $faker->sentence(rand(5, 10)),
                    'user_id' => $group->users()->inRandomOrder()->first()->id, // comment by a random user from the group
                    'post_id' => $post->id,
                    'parent_id' => null,
                ]);

                // add a reply to the comment
                $post->comments()->create([
                    'content' => $faker->sentence(rand(5, 10)),
                    'user_id' => $group->users()->whereNotIn('users.id', [$post->comments()->first()->user_id])->inRandomOrder()->first()->id, // comment by a random user from the group, that's not the parent comment author
                    'post_id' => $post->id,
                    'parent_id' => $post->comments()->first()->id,
                ]);
            }
        }
    }
}
