<?php

namespace Database\Seeders;

use App\Models\Group;
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
        $faker = Faker::create(); // create a Faker instance

        // add one post to the FFA group "General" (id 1)
        $user = User::inRandomOrder()->first(); // get a random user
        
        $post = Post::create([
            'title' => $faker->sentence(rand(5, 10)),
            'content' => $faker->paragraph(rand(4, 10)),
            'user_id' => $user->id,
            'group_id' => 1,
            'status' => (bool) rand(0, 1)
        ]);

        for($i = 0; $i < 9; $i++) {
            $user = User::inRandomOrder()->first(); // get a random user
            $group = $user->groups()->inRandomOrder()->first(); // get a random group from that user
            $ffa_groups = Group::where('is_ffa', true)->pluck('id')->toArray();

            $post = Post::create([
                'title' => $faker->sentence(rand(5, 10)),
                'content' => $faker->paragraph(rand(4, 10)),
                'user_id' => $user->id,
                'group_id' => $group?->id ? $group->id : $ffa_groups[array_rand($ffa_groups)],  // if user has no group, assign to one of the FFA groups
                'status' => (bool) rand(0, 1)
            ]);

            // optionally add attachments and comments
            if (rand(0, 1)) {
                $post->attachments()->createMany([
                    [
                        'name' => 'placeholder_image_' . rand(1, 500) . '.jpg',
                        'type' => 'image',
                        'path' => 'placeholder/rtanj.jpg',
                    ],
                    [
                        'name' => 'document_' . rand(1, 500) . '.txt',
                        'type' => 'document',
                        'path' => 'placeholder/sample.txt',
                    ]
                ]);

                //add one single comment
                $post->comments()->create([
                    'content' => $faker->sentence(rand(5, 10)),
                    'user_id' => $group->users()->inRandomOrder()->first()?->id, // comment by a random user from the group
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
