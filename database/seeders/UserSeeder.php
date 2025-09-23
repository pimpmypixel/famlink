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
                'role' => 'admin',
            ],
            [
                'name' => 'System Administrator',
                'email' => 'admin@famlink.test',
                'password' => 'password',
                'role' => 'admin',
            ],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@famlink.test',
                'password' => 'password',
                'role' => 'admin',
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

        // Step 1: Create 5 caseworkers, 5 psychiatrists, 5 witnesses
        $authorityUsers = [];

        // Create 5 caseworkers
        for ($i = 1; $i <= 5; $i++) {
            $caseworker = User::factory()->create([
                'name' => 'Caseworker #'.$i,
                'email' => 'caseworker'.$i.'@famlink.test',
                'password' => 'password',
                'family_id' => null, // Authorities don't belong to families
            ]);
            $caseworker->assignRole('sagsbehandler');
            $authorityUsers['caseworkers'][] = $caseworker;
        }

        // Create 5 psychiatrists
        for ($i = 1; $i <= 5; $i++) {
            $psychiatrist = User::factory()->create([
                'name' => 'Psychiatrist #'.$i,
                'email' => 'psychiatrist'.$i.'@famlink.test',
                'password' => 'password',
                'family_id' => null, // Authorities don't belong to families
            ]);
            $psychiatrist->assignRole('psykiater');
            $authorityUsers['psychiatrists'][] = $psychiatrist;
        }

        // Create 5 lawyers
        for ($i = 1; $i <= 5; $i++) {
            $lawyer = User::factory()->create([
                'name' => 'Lawyer #'.$i,
                'email' => 'lawyer'.$i.'@famlink.test',
                'password' => 'password',
                'family_id' => null, // Authorities don't belong to families
            ]);
            $lawyer->assignRole('advokat');
            $authorityUsers['lawyers'][] = $lawyer;
        }

        // Create 5 witnesses
        for ($i = 1; $i <= 5; $i++) {
            $witness = User::factory()->create([
                'name' => 'Witness #'.$i,
                'email' => 'witness'.$i.'@famlink.test',
                'password' => 'password',
                'family_id' => null, // Witnesses don't belong to families
            ]);
            $witness->assignRole('vidne');
            $authorityUsers['witnesses'][] = $witness;
        }

        // Create guest user (temporary role, no family)
        $guestUser = User::factory()->create([
            'name' => 'Guest User',
            'email' => 'guest@famlink.test',
            'password' => 'password',
            'family_id' => null,
        ]);
        $guestUser->assignRole('temporary');

        // Step 2: Create children with 1 or 2 parents for each family
        $families = Family::all();
        $danishFirstNames = [
            'male' => ['Anders', 'Christian', 'Jens', 'Lars', 'Michael', 'Niels', 'Ole', 'Peter', 'Rasmus', 'Thomas', 'Henrik', 'Jan', 'Martin', 'Morten', 'Per', 'Søren', 'Torben', 'Erik', 'Flemming', 'Hans'],
            'female' => ['Anne', 'Bente', 'Camilla', 'Dorte', 'Else', 'Freja', 'Gitte', 'Hanne', 'Ida', 'Jette', 'Karen', 'Lene', 'Mette', 'Nina', 'Pia', 'Rita', 'Susanne', 'Tina', 'Ulla', 'Vibeke'],
        ];

        $familyAuthorities = []; // Track which authorities are assigned to which families

        foreach ($families as $family) {
            // Create child for this family
            $child = User::factory()->create([
                'name' => $family->child_name,
                'email' => strtolower($family->child_name).'_'.strtolower($family->name).'@famlink.test',
                'password' => 'password',
                'family_id' => $family->id,
            ]);
            $child->assignRole('barn');

            // Create 1 or 2 parents for this family
            $numParents = rand(1, 2);
            $parents = [];

            for ($i = 0; $i < $numParents; $i++) {
                $gender = $i === 0 ? 'male' : 'female'; // First parent male, second female if exists
                $role = $gender === 'male' ? 'far' : 'mor';
                $firstName = $danishFirstNames[$gender][array_rand($danishFirstNames[$gender])];

                $parent = User::factory()->create([
                    'name' => $firstName.' '.$family->name,
                    'email' => strtolower($firstName).'_'.strtolower($family->name).'@famlink.test',
                    'password' => 'password',
                    'family_id' => $family->id,
                ]);
                $parent->assignRole('approved'); // Parents are approved
                $parents[] = $parent;
            }

            // Step 3: Attach authorities to each parent
            // Each approved parent must have at least 1 authority
            foreach ($parents as $parent) {
                $assignedAuthorities = [];

                // Randomly assign 1-3 authorities per parent (caseworkers, psychiatrists, lawyers)
                $authorityTypes = ['caseworkers', 'psychiatrists', 'lawyers'];
                $numAuthorities = rand(1, 3);

                for ($i = 0; $i < $numAuthorities; $i++) {
                    $authorityType = $authorityTypes[array_rand($authorityTypes)];
                    $availableAuthorities = $authorityUsers[$authorityType];

                    // Find an authority not already assigned to this family
                    $unassignedAuthorities = collect($availableAuthorities)->filter(function ($authority) use ($family, $familyAuthorities) {
                        return ! isset($familyAuthorities[$family->id]) ||
                               ! in_array($authority->id, $familyAuthorities[$family->id]);
                    });

                    if ($unassignedAuthorities->isNotEmpty()) {
                        $assignedAuthority = $unassignedAuthorities->random();
                        $assignedAuthorities[] = $assignedAuthority;

                        // Track assignment
                        if (! isset($familyAuthorities[$family->id])) {
                            $familyAuthorities[$family->id] = [];
                        }
                        $familyAuthorities[$family->id][] = $assignedAuthority->id;
                    }
                }

                // If no authorities were assigned (shouldn't happen), assign at least one caseworker
                if (empty($assignedAuthorities)) {
                    $caseworker = $authorityUsers['caseworkers'][array_rand($authorityUsers['caseworkers'])];
                    $assignedAuthorities[] = $caseworker;

                    if (! isset($familyAuthorities[$family->id])) {
                        $familyAuthorities[$family->id] = [];
                    }
                    $familyAuthorities[$family->id][] = $caseworker->id;
                }

                // Store authority assignments in user's metadata or create relationships
                // For now, we'll track this in memory - in a real app you'd want a proper relationship table
                $parent->authorities_assigned = collect($assignedAuthorities)->pluck('id')->toArray();
            }

            // Assign a caseworker as the family creator (created_by)
            $familyCreator = $authorityUsers['caseworkers'][array_rand($authorityUsers['caseworkers'])];
            $family->update(['created_by' => $familyCreator->id]);
        }

        // Create some additional standalone approved users (not part of families)
        for ($i = 1; $i <= 10; $i++) {
            $user = User::factory()->create([
                'name' => 'Approved User #'.$i,
                'email' => 'approved'.$i.'@famlink.test',
                'password' => 'password',
                'family_id' => null,
            ]);
            $user->assignRole('approved');
        }

        if ($this->command) {
            $this->command->info('Created users: '.User::count().' total');
            $this->command->info('- Admins: '.User::role('admin')->count());
            $this->command->info('- Caseworkers: '.User::role('sagsbehandler')->count());
            $this->command->info('- Psychiatrists: '.User::role('psykiater')->count());
            $this->command->info('- Lawyers: '.User::role('advokat')->count());
            $this->command->info('- Witnesses: '.User::role('vidne')->count());
            $this->command->info('- Children: '.User::role('barn')->count());
            $this->command->info('- Fathers: '.User::role('far')->count());
            $this->command->info('- Mothers: '.User::role('mor')->count());
            $this->command->info('- Approved users: '.User::role('approved')->count());
            $this->command->info('- Temporary users: '.User::role('temporary')->count());
            $this->command->info('- Families with complete structure: '.$families->count());
        }
    }
}
