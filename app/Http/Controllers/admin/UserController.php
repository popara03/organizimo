<?php

namespace App\Http\Controllers\admin;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function store(Request $request){
        $validated = $request -> validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => [
                'required',
                Password::defaults()
                    ->min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'position' => 'nullable|string|max:255',
            'role_id' => 'required|exists:roles,id',
            'image' => 'array|max:1',
            'image.0' => [
                'image',
                'mimes:jpeg,png,jpg,svg,webp',
                'max:2048',
            ],
        ]);

        try {
            $user = new User();
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->password = bcrypt($validated['password']);
            $user->position = $validated['position'];
            $user->role_id = $validated['role_id'];
            if(isset($validated['image']) && count($validated['image']) > 0){
                $user->image = $validated['image'][0]->store('images', 'public');
            }
            $user->save();

            $user->load('role');

            $response = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'position' => $user->position,
                'image' => $user->image,
                'role_id' => $user->role_id,
                'role' => [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ],
                'created_at' => $user->created_at,
            ];

            return Inertia::render('admin/users', [
                'user' => $response
            ])->with('success', 'User created successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'An error occurred while creating the user.', 'error' => $e->getMessage()]);
        }
    }

    public function update(Request $request){
        $validated = $request -> validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,'.$request->id,
            'password' => [
                'nullable',
                Password::defaults()
                    ->min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            'position' => 'nullable|string|max:255',
            'role_id' => 'required|exists:roles,id',
            'image' => 'array|max:1',
            'image.0' => [
                'image',
                'mimes:jpeg,png,jpg,svg,webp',
                'max:2048',
            ],
        ]);

        try {
            if(!$request->id){
                return back()->withErrors(['message' => 'Invalid user ID.'], 400);
            }

            $user = User::find($request->id);
            if(!$user) {
                return back()->withErrors(['message' => 'User not found.'], 404);
            }

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            if($validated['password']){
                $user->password = bcrypt($validated['password']);
            }
            $user->position = $validated['position'];
            $user->role_id = $validated['role_id'];
            if(isset($validated['image']) && count($validated['image']) > 0){
                $user->image = $validated['image'][0]->store('images', 'public');
            }
            else{
                $user->image = null;
            }
            $user->save();

            $user->load('role');

            $response = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'position' => $user->position,
                'image' => $user->image,
                'role_id' => $user->role_id,
                'role' => [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ],
                'created_at' => $user->created_at,
            ];

            return Inertia::render('admin/users', [
                'user' => $response
            ])->with('success', 'User updated successfully.');
        } catch (Exception $e) {
            return back()->withErrors(['message' => 'An error occurred while updating the user.', 'error' => $e->getMessage()]);
        }
    }

    public function destroy(string $id){
        if(!$id){
            return response()->json(['message' => 'Invalid ID.'], 400);
        }

        try{
            $user = User::find($id);

            if(!$user){
                return response()->json(['message' => 'User not found.'], 404);
            }

            $user->delete();

            return response()->json(['message' => 'User deleted successfully.'], 200);
        }
        catch(Exception $e){
            return response()->json(['message' => 'An error occurred while deleting the user.', 'error' => $e->getMessage()], 500);
        }
    }
}
