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
            // Creating FFA groups first
            foreach (self::FFA_GROUPS as $g) {
                Group::create(['name' => $g['name'], 'color' => $g['color'], 'is_ffa' => true]);
            }

            // Creating groups with selected users
            foreach (self::OTHER_GROUPS as $g) {
                $group = Group::create(['name' => $g['name'], 'color' => $g['color'], 'is_ffa' => false]);

                // Creating group_user pivot entries
                $users = User::inRandomOrder()->take(rand(2, 4))->get();    // pick 2 to 4 random users
                $group->users()->attach($users);
            }

            // Ensuring all users are in at least one non-FFA group
            $orphanedUsers = User::whereNotIn('id', function($query) {
                $query->select('user_id')
                      ->from('group_user');
            })->get();
            
            if($orphanedUsers->count() > 0) {
                foreach ($orphanedUsers as $u){
                    $u->groups()->attach(Group::where('is_ffa', false)->inRandomOrder()->first()->id);
                }
            }
        } catch (\Exception $e) {
            echo "Error seeding groups: " . $e->getMessage();
        }
    }
}
