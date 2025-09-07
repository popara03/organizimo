<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

        return Inertia::render('admin/groups', [
            'group' => $group->only('id', 'name', 'color', 'is_ffa', 'created_at', 'users')
        ])->with('success', 'Group created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:groups,id',
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

        $group = Group::find($request->id);

        if(!$group){
            return back()->withErrors(['message' => 'Group not found.'], 404);
        }

        $group->update($request->only('name', 'color', 'is_ffa'));

        if(!$request->is_ffa){
            $group->users()->sync($request->users);
        } else {
            // if is_ffa is true, detach all users
            $group->users()->detach();
        }

        return Inertia::render('admin/groups', [
            'group' => $group->only('id', 'name', 'color', 'is_ffa', 'created_at', 'users')
        ])->with('success', 'Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            if(is_null($id)){
                return response()->json(['message' => 'Invalid group ID.'], 400);
            }

            $group = Group::find($id);

            if($group) {
                $group->delete();
                return response()->json(['message' => 'Group deleted successfully.'], 200); 
            }
            else{
                return response()->json(['message' => 'Group not found.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete group. ' . $e->getMessage()], 500);
        }
    }
}
