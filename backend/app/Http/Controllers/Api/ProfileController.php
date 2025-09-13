<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use App\Models\ProfilePicture; // 1. Import the new model
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    // ✅ Get logged-in user info (UPDATED)
    public function getProfile(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Eager load the profile picture relationship
            $user->load('profilePicture');

            // Manually create the response to keep the frontend consistent
            $userResponse = $user->toArray();
            $userResponse['profile_picture'] = $user->profilePicture ? $user->profilePicture->url : null;

            return response()->json(['success' => true, 'user' => $userResponse]);
        } catch (\Exception $e) {
            Log::error('Get Profile Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Could not retrieve profile.'], 500);
        }
    }

    // ✅ Update profile picture (UPDATED)
    public function updatePicture(Request $request)
    {
        try {
            $request->validate([
                'profile_picture' => 'required|url'
            ]);

            $user = JWTAuth::parseToken()->authenticate();

            // Use updateOrCreate to either create a new record or update the existing one
            ProfilePicture::updateOrCreate(
                ['user_id' => $user->id],
                ['url' => $request->profile_picture]
            );

            // We need to refetch the user to return the updated data structure
            $user->load('profilePicture');
            $userResponse = $user->toArray();
            $userResponse['profile_picture'] = $user->profilePicture->url;

            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated successfully',
                'user' => $userResponse
            ]);

        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Update Picture Failed: ' . $e->getMessage() . ' on line ' . $e->getLine() . ' in ' . $e->getFile());
            return response()->json(['success' => false, 'message' => 'An internal server error occurred.'], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();
            
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            
            if ($request->has('phone')) {
                $user->phone = $request->phone;
            }
            
            if ($request->has('address')) {
                $user->location = $request->address;
            }
            
            if ($request->has('details')) {
                $user->bio = $request->details;
            }
            
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }
}




