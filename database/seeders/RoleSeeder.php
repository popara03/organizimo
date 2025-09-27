<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    private const ROLES = ['user', 'admin'];

    public function run(): void
    {
        try{
            foreach(self::ROLES as $role){
                Role::create(['name' => $role]);
            }
        }
        catch (\Exception $e) {
            echo "Error seeding roles: " . $e->getMessage();
        }
    }
}