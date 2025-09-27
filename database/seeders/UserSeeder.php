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
            // creating an admin user first
            $user = new User();
            $user->name = Faker::create()->name();
            $user->email = Faker::create()->unique()->safeEmail();
            $user->position = Faker::create()->jobTitle();
            $user->password = bcrypt('password');
            $user->role_id = 2; // admin
            $user->image = 'https://avatar.iran.liara.run/public';
            $user->save();

            // creating 10 regular users
            for($i=0; $i<10; $i++){
                $user = new User();
                $user->name = Faker::create()->name();
                $user->email = Faker::create()->unique()->safeEmail();
                $user->position = Faker::create()->jobTitle();
                $user->password = bcrypt('password');
                $user->role_id = 1; // user
                $user->image = 'https://avatar.iran.liara.run/public';
                $user->save();
            }
        } catch (\Exception $e) {
            echo "Error seeding users: " . $e->getMessage();
        }
    }
}
