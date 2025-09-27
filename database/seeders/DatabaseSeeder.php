<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\GroupSeeder;
use Database\Seeders\PostSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // running seeders in this order
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            GroupSeeder::class,
            PostSeeder::class,
        ]);
    }
}
