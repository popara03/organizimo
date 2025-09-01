<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    private const ROLES = ['user', 'admin'];
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach(self::ROLES as $role){
            Role::create(['name' => $role]);
        }
    }
}
