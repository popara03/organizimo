<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,svg,webp', 'max:2048'],
        ]);

        $user = $request->user();
        
        //bezbednija (samo sta je proslo validaciju) i kraca varijanta za update (ne svojstvo po svojstvo)
        $user->fill($validated);

        // extra check for image, since it can pass validation as null and result in losing the existing image
        if($request->hasFile('image')) {
            $user->image = $request->file('image')->store('images', 'public');
        }

        if($user->isDirty()) {
            $user->save();
            Auth::setUser($user->fresh());
        }

        return back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
