<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class GroupSeeder extends Seeder
{
    private const FFA_GROUPS = [
        [
            'name' => 'General',
            'color' => '#369AC3',
        ],
        [
            'name' => 'Team building',
            'color' => '#9EB41D',
        ],
        [
            'name' => 'Random',
            'color' => '#C336BE',
        ]
    ];

    private const OTHER_GROUPS = [
        'Marketing',
        'Finance',
        'Sales',
        'IT',
        'Design',
        'Customer Support',
        'Legal',
    ];

    public function run(): void
    {
        try {
            // Creating FFA groups first
            foreach (self::FFA_GROUPS as $group) {
                Group::create(['name' => $group['name'], 'color' => $group['color']], 'is_ffa', true);
            }

            // Creating groups with selected users
            foreach (self::OTHER_GROUPS as $group) {
                $group = Group::create(['name' => $group, 'color' => Faker::create()->safeHexColor(), 'is_ffa' => false]);

                // Creating group_user pivot entries
                $users = User::inRandomOrder()->take(rand(2, 4))->get();    // order randomly and then take 2 to 4 users
                $group->users()->attach($users);
            }
        } catch (\Exception $e) {
            echo "Error seeding groups: " . $e->getMessage();
        }
    }
}
