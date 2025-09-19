<?php

namespace Database\Seeders;

use App\Models\Family;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin users
        $adminUsers = [
            [
                'name' => 'Admin User',
                'email' => 'pimpmypixel@me.com',
                'password' => 'hejhejhej',
                'role' => 'admin'
            ],
            [
                'name' => 'System Administrator',
                'email' => 'admin@famlink.test',
                'password' => 'password',
                'role' => 'admin'
            ],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@famlink.test',
                'password' => 'password',
                'role' => 'admin'
            ],
        ];

        foreach ($adminUsers as $adminData) {
            $admin = User::factory()->create([
                'name' => $adminData['name'],
                'email' => $adminData['email'],
                'password' => $adminData['password'],
            ]);
            $admin->assignRole($adminData['role']);
        }

        // Create social workers/consultants
        $socialWorkers = [
            [
                'name' => 'DAFL Consultant #1',
                'email' => 'consultant1@dafl.dk',
                'password' => 'password',
            ],
            [
                'name' => 'DAFL Consultant #2',
                'email' => 'consultant2@dafl.dk',
                'password' => 'password',
            ],
            [
                'name' => 'Social Worker #1',
                'email' => 'socialworker1@famlink.test',
                'password' => 'password',
            ],
            [
                'name' => 'Social Worker #2',
                'email' => 'socialworker2@famlink.test',
                'password' => 'password',
            ],
            [
                'name' => 'Family Consultant #1',
                'email' => 'familyconsultant1@famlink.test',
                'password' => 'password',
            ],
            [
                'name' => 'Family Consultant #2',
                'email' => 'familyconsultant2@famlink.test',
                'password' => 'password',
            ],
            [
                'name' => 'Legal Advisor #1',
                'email' => 'legaladvisor1@famlink.test',
                'password' => 'password',
            ],
            [
                'name' => 'Legal Advisor #2',
                'email' => 'legaladvisor2@famlink.test',
                'password' => 'password',
            ],
        ];

        $socialWorkerUsers = [];
        foreach ($socialWorkers as $workerData) {
            $worker = User::factory()->create([
                'name' => $workerData['name'],
                'email' => $workerData['email'],
                'password' => $workerData['password'],
            ]);
            $worker->assignRole('myndighed');
            $socialWorkerUsers[] = $worker;
        }

        // Create additional users with different roles
        $otherUsers = [
            [
                'name' => 'Other Guardian',
                'email' => 'other@example.com',
                'password' => 'password',
                'role' => 'andet'
            ],
            [
                'name' => 'Temporary User',
                'email' => 'temporary@famlink.test',
                'password' => 'password',
                'role' => 'temporary'
            ],
            [
                'name' => 'Approved User',
                'email' => 'approved@famlink.test',
                'password' => 'password',
                'role' => 'approved'
            ],
        ];

        foreach ($otherUsers as $userData) {
            $user = User::factory()->create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => $userData['password'],
            ]);
            $user->assignRole($userData['role']);
        }

        // Create parents for each family
        $families = Family::all();
        $socialWorkerIndex = 0;

        $danishFirstNames = [
            'male' => ['Anders', 'Christian', 'Jens', 'Lars', 'Michael', 'Niels', 'Ole', 'Peter', 'Rasmus', 'Thomas', 'Henrik', 'Jan', 'Martin', 'Morten', 'Per', 'Søren', 'Torben', 'Erik', 'Flemming', 'Hans'],
            'female' => ['Anne', 'Bente', 'Camilla', 'Dorte', 'Else', 'Freja', 'Gitte', 'Hanne', 'Ida', 'Jette', 'Karen', 'Lene', 'Mette', 'Nina', 'Pia', 'Rita', 'Susanne', 'Tina', 'Ulla', 'Vibeke']
        ];

        foreach ($families as $family) {
            // Create father
            $fatherFirstName = $danishFirstNames['male'][array_rand($danishFirstNames['male'])];
            $father = User::factory()->create([
                'name' => $fatherFirstName . ' ' . $family->name,
                'email' => strtolower($fatherFirstName) . '_' . strtolower($family->name) . '@example.com',
                'password' => 'password',
                'family_id' => $family->id,
            ]);
            $father->assignRole('far');

            // Create mother
            $motherFirstName = $danishFirstNames['female'][array_rand($danishFirstNames['female'])];
            $mother = User::factory()->create([
                'name' => $motherFirstName . ' ' . $family->name,
                'email' => strtolower($motherFirstName) . '_' . strtolower($family->name) . '@example.com',
                'password' => 'password',
                'family_id' => $family->id,
            ]);
            $mother->assignRole('mor');

            // Assign a social worker to this family
            $designatedWorker = $socialWorkerUsers[$socialWorkerIndex % count($socialWorkerUsers)];
            $family->update(['created_by' => $designatedWorker->id]);

            // Also assign the social worker to this family (they can access it)
            $designatedWorker->family_id = $family->id;
            $designatedWorker->save();

            $socialWorkerIndex++;
        }

        // Create additional standalone users for testing
        for ($i = 1; $i <= 20; $i++) {
            $gender = rand(0, 1) ? 'male' : 'female';
            $firstName = $danishFirstNames[$gender][array_rand($danishFirstNames[$gender])];
            $lastName = $families->random()->name;

            $user = User::factory()->create([
                'name' => $firstName . ' ' . $lastName,
                'email' => strtolower($firstName) . '.' . strtolower($lastName) . $i . '@test.com',
                'password' => 'password',
                'family_id' => rand(0, 1) ? $families->random()->id : null, // Some users not assigned to families
            ]);

            // Randomly assign roles
            $roles = ['far', 'mor', 'myndighed', 'andet', 'temporary', 'approved'];
            $user->assignRole($roles[array_rand($roles)]);
        }

        $this->command->info('Created users: ' . User::count() . ' total');
        $this->command->info('- Admins: ' . User::role('admin')->count());
        $this->command->info('- Social Workers: ' . User::role('myndighed')->count());
        $this->command->info('- Fathers: ' . User::role('far')->count());
        $this->command->info('- Mothers: ' . User::role('mor')->count());
        $this->command->info('- Other users: ' . User::role(['andet', 'temporary', 'approved'])->count());
    }
}