<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaterialChunk extends Model
{
    use HasFactory;

    protected $fillable = [
        'material_id',
        'chunk_index',
        'content',
        'page_number',
    ];

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
