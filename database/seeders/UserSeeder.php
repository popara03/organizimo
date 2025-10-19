<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        try{
            $faker = Faker::create();

            // creating an admin user first
            $user = new User();
            $user->name = $faker->name();
            $user->email = 'admin@admin.com';
            $user->position = $faker->jobTitle();
            $user->password = bcrypt('Admin123!');
            $user->role_id = 2; // admin
            $user->image = null;
            $user->save();

            // creating 10 regular users
            for($i=0; $i<10; $i++){
                $user = new User();
                $user->name = $faker->name();
                $user->email = $faker->unique()->safeEmail();
                $user->position = $faker->jobTitle();
                $user->password = bcrypt('password');
                $user->role_id = 1; // user
                $user->image = null;
                $user->save();
            }
        } catch (\Exception $e) {
            echo "Error seeding users: " . $e->getMessage();
        }
    }
}
