<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'is_ffa' => 'required|boolean',
            'users'  => [
                'nullable',
                'array',
                function ($attribute, $value, $fail) use ($request) {
                    if (!$request->is_ffa && !is_null($value) && count($value) < 1) {
                        $fail("The {$attribute} field must have at least 1 item.");
                    }
                },
            ],
            'users.*' => 'integer|exists:users,id',
        ]);

        //create group and then set users in the pivot table
        $group = Group::create($request->only('name', 'color', 'is_ffa'));
        
        if(!$request->is_ffa){
            $group->users()->sync($request->users);
        }

        return back()->with('success', 'Group created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
