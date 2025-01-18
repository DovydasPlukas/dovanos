<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AttributeGroup;
use App\Models\Attribute;

class OccasionAttributeSeeder extends Seeder
{
    public function run(): void
    {
        // Create Occasion group
        $group = AttributeGroup::create([
            'name' => 'Proga'
        ]);

        // Create attributes for occasions
        $occasions = ["Kalėdos", "Gimtadienis", "Tėvo diena", "Mamos diena", "Santuoka"];
        
        foreach ($occasions as $occasion) {
            Attribute::create([
                'name' => $occasion,
                'attribute_group_id' => $group->id
            ]);
        }
    }
}
