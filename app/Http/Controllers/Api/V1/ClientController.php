<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    /**
     * Display a listing of the clients.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Client::where('office_id', $user->office_id);

        // البحث
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'ilike', "%{$search}%")
                  ->orWhere('last_name', 'ilike', "%{$search}%")
                  ->orWhere('national_id', 'ilike', "%{$search}%")
                  ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        // تصفية حسب الحالة الاجتماعية
        if ($request->has('marital_status')) {
            $query->where('marital_status', $request->marital_status);
        }

        // ترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $clients = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'تم جلب العملاء بنجاح',
            'data' => $clients
        ]);
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'national_id' => 'required|string|unique:clients,national_id,NULL,id,office_id,' . $user->office_id,
            'id_card_number' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
        ]);

        $validated['office_id'] = $user->office_id;

        $client = Client::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء العميل بنجاح',
            'data' => [
                'client' => $client
            ]
        ], 201);
    }

    /**
     * Display the specified client.
     */
    public function show(Client $client)
    {
        // التأكد أن العميل ينتمي لمكتب المستخدم
        $this->authorize('view', $client);

        return response()->json([
            'success' => true,
            'message' => 'تم جلب العميل بنجاح',
            'data' => [
                'client' => $client
            ]
        ]);
    }

    /**
     * Update the specified client.
     */
    public function update(Request $request, Client $client)
    {
        // التأكد أن العميل ينتمي لمكتب المستخدم
        $this->authorize('update', $client);

        $user = Auth::user();

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'father_name' => 'nullable|string|max:255',
            'mother_name' => 'nullable|string|max:255',
            'national_id' => 'sometimes|string|unique:clients,national_id,' . $client->id . ',id,office_id,' . $user->office_id,
            'id_card_number' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'birth_place' => 'nullable|string|max:255',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
        ]);

        $client->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث العميل بنجاح',
            'data' => [
                'client' => $client
            ]
        ]);
    }

    /**
     * Remove the specified client.
     */
    public function destroy(Client $client)
    {
        // التأكد أن العميل ينتمي لمكتب المستخدم
        $this->authorize('delete', $client);

        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف العميل بنجاح',
            'data' => null
        ]);
    }
}