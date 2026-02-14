<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\TemplateField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Template::with('fields')
            ->where('office_id', $user->office_id);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->has('contract_type')) {
            $query->where('contract_type', $request->contract_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);

        $perPage = $request->get('per_page', 15);
        $templates = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'تم جلب القوالب بنجاح',
            'data' => $templates
        ]);
    }

   public function store(Request $request)
{
    $user = Auth::user();

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'contract_type' => 'required|string|max:100',
        'description' => 'nullable|string',
        'status' => 'required|in:draft,active',
        'content' => 'required|string',
         'fields' => 'sometimes|array', // ✅ changed from 'required' to 'sometimes'
        'fields.*.label' => 'required_with:fields|string|max:255',
        'fields.*.key' => 'required_with:fields|string|max:100',
        'fields.*.type' => 'required_with:fields|in:text,number,date,select,textarea',
        'fields.*.source' => 'required_with:fields|in:manual,client,system',
        'fields.*.is_required' => 'boolean',
        'fields.*.client_role' => 'nullable|in:seller,buyer,other',
        'fields.*.client_field' => 'nullable|string',
        'fields.*.system_value' => 'nullable|string',
        'fields.*.options' => 'nullable|array',
        'fields.*.sort_order' => 'integer',
    ]);

    try {
        DB::beginTransaction();

        $template = Template::create([
            'office_id' => $user->office_id,
            'created_by' => $user->id,
            'name' => $validated['name'],
            'contract_type' => $validated['contract_type'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
    'content' => $validated['content'], // ✅ هنا
        ]);

        // ✅ فقط إذا كانت fields موجودة وليست فارغة
        if ($request->has('fields') && is_array($validated['fields'])) {
            foreach ($validated['fields'] as $fieldData) {
                $template->fields()->create($fieldData);
            }
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء القالب بنجاح',
            'data' => [
                'template' => $template->load('fields')
            ]
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        
        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ أثناء إنشاء القالب',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function show(Template $template)
    {
        if ($template->office_id !== Auth::user()->office_id) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح بالوصول'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'تم جلب القالب بنجاح',
            'data' => [
                'template' => $template->load('fields')
            ]
        ]);
    }

    public function update(Request $request, Template $template)
{
    if ($template->office_id !== Auth::user()->office_id) {
        return response()->json([
            'success' => false,
            'message' => 'غير مصرح بالوصول'
        ], 403);
    }

    $validated = $request->validate([
        'name' => 'sometimes|string|max:255',
        'contract_type' => 'sometimes|string|max:100',
        'description' => 'nullable|string',
        'status' => 'sometimes|in:draft,active',
        'content' => 'required|string',
         'fields' => 'sometimes|array', // ✅ changed
        'fields.*.label' => 'required_with:fields|string|max:255',
        'fields.*.key' => 'required_with:fields|string|max:100',
        'fields.*.type' => 'required_with:fields|in:text,number,date,select,textarea',
        'fields.*.source' => 'required_with:fields|in:manual,client,system',
        'fields.*.is_required' => 'boolean',
        'fields.*.client_role' => 'nullable|in:seller,buyer,other',
        'fields.*.client_field' => 'nullable|string',
        'fields.*.system_value' => 'nullable|string',
        'fields.*.options' => 'nullable|array',
        'fields.*.sort_order' => 'integer',
    ]);

    try {
        DB::beginTransaction();

        $template->update($validated);

        // ✅ فقط إذا كان هناك حقول جديدة
        if ($request->has('fields')) {
            $template->fields()->delete();
            
            if (is_array($validated['fields']) && count($validated['fields']) > 0) {
                foreach ($validated['fields'] as $fieldData) {
                    $template->fields()->create($fieldData);
                }
            }
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث القالب بنجاح',
            'data' => [
                'template' => $template->fresh()->load('fields')
            ]
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        
        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ أثناء تحديث القالب',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function destroy(Template $template)
    {
        if ($template->office_id !== Auth::user()->office_id) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح بالوصول'
            ], 403);
        }

        $template->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف القالب بنجاح',
            'data' => null
        ]);
    }

    public function duplicate(Request $request, Template $template)
    {
        if ($template->office_id !== Auth::user()->office_id) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح بالوصول'
            ], 403);
        }

        try {
            DB::beginTransaction();

            $newTemplate = $template->replicate();
            $newTemplate->name = $template->name . ' (نسخة)';
            $newTemplate->status = 'draft';
            $newTemplate->created_by = Auth::id();
            $newTemplate->save();

            foreach ($template->fields as $field) {
                $newField = $field->replicate();
                $newField->template_id = $newTemplate->id;
                $newField->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم نسخ القالب بنجاح',
                'data' => [
                    'template' => $newTemplate->load('fields')
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء نسخ القالب',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}