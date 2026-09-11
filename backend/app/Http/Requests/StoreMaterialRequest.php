<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_key' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf|max:51200', // max 50MB
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Berkas materi PDF wajib diunggah.',
            'file.mimes' => 'Format berkas harus PDF.',
            'file.max' => 'Ukuran berkas maksimal 50MB.',
            'title.required' => 'Judul materi wajib diisi.',
            'student_key.required' => 'Student key wajib disertakan.',
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
