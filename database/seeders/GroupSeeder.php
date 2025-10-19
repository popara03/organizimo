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
            'name' => 'Events',
            'color' => '#C336BE',
        ]
    ];

    private const OTHER_GROUPS = [
        [
            'name' => 'Marketing',
            'color' => '#E74C3C',
        ],
        [
            'name' => 'Finance',
            'color' => '#F39C12',
        ],
        [
            'name' => 'Sales',
            'color' => '#27AE60',
        ],
        [
            'name' => 'IT',
            'color' => '#3498DB',
        ],
        [
            'name' => 'Design',
            'color' => '#8E44AD',
        ],
        [
            'name' => 'Customer Support',
            'color' => '#16A085',
        ]
    ];

    public function run(): void
    {
        try {
            $faker = Faker::create();

            // Creating FFA groups first
            foreach (self::FFA_GROUPS as $group) {
                Group::create(['name' => $group['name'], 'color' => $group['color'], 'is_ffa' => true]);
            }

            // Creating groups with selected users
            foreach (self::OTHER_GROUPS as $group) {
                $group = Group::create(['name' => $group['name'], 'color' => $group['color'], 'is_ffa' => false]);

                // Creating group_user pivot entries
                $users = User::inRandomOrder()->take(rand(2, 4))->get();    // order randomly and then take 2 to 4 users
                $group->users()->attach($users);
            }
        } catch (\Exception $e) {
            echo "Error seeding groups: " . $e->getMessage();
        }
    }
}
