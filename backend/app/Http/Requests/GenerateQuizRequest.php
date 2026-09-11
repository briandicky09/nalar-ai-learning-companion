<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GenerateQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_key' => 'required|string|max:100',
            'material_id' => 'required|integer|exists:materials,id',
            'topic_id' => 'nullable|integer|exists:topics,id',
            'number_of_questions' => 'nullable|integer|min:1|max:30',
        ];
    }

    public function messages(): array
    {
        return [
            'material_id.required' => 'ID materi wajib disertakan.',
            'material_id.exists' => 'Materi tidak ditemukan.',
            'topic_id.exists' => 'Topik tidak ditemukan.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $validator->errors(),
        ], 422));
    }
}
