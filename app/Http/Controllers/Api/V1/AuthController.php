<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * تسجيل الدخول
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة.'],
            ]);
        }

        // التحقق من حالة المكتب
        if ($user->office->subscription_status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'المكتب غير نشط. الرجاء التواصل مع الدعم.',
            ], 403);
        }

        // إنشاء توكن
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'office_id' => $user->office_id,
                ],
                'office' => [
                    'id' => $user->office->id,
                    'name' => $user->office->name,
                    'subscription_status' => $user->office->subscription_status,
                ],
                'subscription' => $user->office->subscriptions()
                    ->where('status', 'active')
                    ->latest()
                    ->first(),
                'token' => $token,
            ],
        ]);
    }

    /**
     * تسجيل الخروج
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الخروج بنجاح',
        ]);
    }

    /**
     * الحصول على معلومات المستخدم الحالي
     */
    public function me(Request $request)
    {
        $user = $request->user()->load('office');

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'office_id' => $user->office_id,
                ],
                'office' => [
                    'id' => $user->office->id,
                    'name' => $user->office->name,
                    'subscription_status' => $user->office->subscription_status,
                ],
            ],
        ]);
    }
}