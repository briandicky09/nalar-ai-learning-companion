<?php

namespace App\Services;

use App\Models\Material;
use App\Models\Topic;
use App\Models\QuizAttempt;
use App\Services\Contracts\AIServiceInterface;
use Illuminate\Support\Collection;

class MockAIService implements AIServiceInterface
{
    public function analyzeMaterial(Material $material, array $chunks): array
    {
        // Extract topics based on content or fallback to standard PBO core curriculum
        $combinedText = strtolower(implode(' ', array_column($chunks, 'content')));

        $topics = [
            [
                'name' => 'Encapsulation',
                'description' => 'Konsep pembungkusan data dan method dalam satu unit class serta pembatasan akses data menggunakan modifier private, protected, dan public.',
                'order' => 1,
            ],
            [
                'name' => 'Inheritance',
                'description' => 'Pewarisan sifat, atribut, dan method dari parent class (super class) ke child class (sub class) untuk reusabilitas kode.',
                'order' => 2,
            ],
            [
                'name' => 'Polymorphism',
                'description' => 'Kemampuan suatu objek memiliki banyak bentuk melalui mekanisme method overloading (compile-time) dan method overriding (runtime).',
                'order' => 3,
            ],
            [
                'name' => 'Abstraction',
                'description' => 'Penyederhanaan kompleksitas sistem dengan menyembunyikan detail implementasi menggunakan abstract class dan interface.',
                'order' => 4,
            ],
        ];

        return $topics;
    }

    public function answerTutorQuestion(string $question, ?Material $material, array $contextChunks): array
    {
        $q = strtolower($question);
        $materialId = $material ? $material->id : null;
        $sources = [];

        // Build grounded sources from context chunks
        if (!empty($contextChunks)) {
            foreach (array_slice($contextChunks, 0, 2) as $chunk) {
                $sources[] = [
                    'material_id' => $chunk['material_id'] ?? $materialId,
                    'page' => $chunk['page_number'] ?? 1,
                    'excerpt' => mb_substr($chunk['content'] ?? '', 0, 120) . '...',
                ];
            }
        } else if ($materialId) {
            $sources[] = [
                'material_id' => $materialId,
                'page' => 1,
                'excerpt' => 'Materi: ' . ($material->title ?? 'Materi Perkuliahan'),
            ];
        }

        if (str_contains($q, 'polymorphism') || str_contains($q, 'polimorfisme')) {
            $answer = "Dalam Pemrograman Berorientasi Objek (PBO), **Polymorphism** (banyak bentuk) mengizinkan satu antarmuka (interface) digunakan untuk aksi yang berbeda pada objek yang berbeda.\n\nContoh analogi nyata:\n- Class induk `Hewan` memiliki method `bersuara()`.\n- Objek `Kucing` akan mengeluarkan suara *'Meong'*.\n- Objek `Anjing` akan mengeluarkan suara *'Guk guk'*.\n\nDalam bahasa pemrograman (seperti Java atau PHP), polymorphism dicapai lewat dua cara:\n1. **Overriding (Runtime)**: Subclass menimpa implementasi method milik superclass.\n2. **Overloading (Compile-time)**: Method bernama sama tetapi parameternya berbeda.";
        } elseif (str_contains($q, 'encapsulation') || str_contains($q, 'enkapsulasi') || str_contains($q, 'modifier') || str_contains($q, 'getter') || str_contains($q, 'setter')) {
            $answer = "**Encapsulation (Enkapsulasi)** adalah teknik menyembunyikan data internal suatu objek dari modifikasi sembarangan dari luar.\n\nCara kerjanya:\n- Atribut diberi modifier `private` sehingga tidak bisa diakses langsung dari luar class.\n- Disediakan method publik berupa **Getter** (mengambil nilai) dan **Setter** (memvalidasi dan mengubah nilai).\n\nAnalogi: Bayangkan kapsul obat. Kamu tidak melihat serbuk obat di dalamnya secara langsung, tetapi meminumnya lewat pembungkus kapsul yang aman.";
        } elseif (str_contains($q, 'inheritance') || str_contains($q, 'pewarisan') || str_contains($q, 'turunan')) {
            $answer = "**Inheritance (Pewarisan)** memungkinkan sebuah class (subclass) mewarisi atribut dan method dari class lain (superclass).\n\nManfaat utamanya adalah *Code Reusability* — kita tidak perlu menulis ulang kode yang sama.\n\nContoh:\n- Superclass: `Kendaraan` (memiliki atribut `kecepatan`, method `bergerak()`)\n- Subclass: `Mobil` dan `Motor` mewarisi `kecepatan` dan `bergerak()`, namun dapat memiliki atribut unik seperti `jumlahPintu`.";
        } elseif (str_contains($q, 'abstraction') || str_contains($q, 'abstraksi') || str_contains($q, 'interface')) {
            $answer = "**Abstraction (Abstraksi)** adalah proses menyembunyikan detail teknis yang kompleks dan hanya menampilkan fitur penting kepada pengguna.\n\nContoh nyata:\nKetika kamu menyetir mobil, kamu hanya perlu menekan pedal gas untuk melaju, tanpa harus tahu bagaimana proses injeksi bahan bakar ke mesin silinder berlangsung. Di PBO, ini diimplementasikan via `abstract class` atau `interface`.";
        } elseif (str_contains($q, 'class') && str_contains($q, 'object')) {
            $answer = "Perbedaan mendasar antara **Class** dan **Object**:\n\n1. **Class**: Adalah cetak biru *(blueprint)* atau template rancangan.\n2. **Object**: Adalah wujud nyata *(instance)* hasil cetakan dari Class.\n\n**Analogi Sederhana**:\n- **Class**: Desain arsitektur rumah di atas kertas blueprint.\n- **Object**: Rumah fisik bertingkat dua yang sudah dibangun di dunia nyata berdasarkan cetak biru tersebut.";
        } else {
            $answer = "Pertanyaan yang sangat bagus! Berdasarkan materi yang kamu unggah, konsep ini berkaitan erat dengan fondasi pemrograman berorientasi objek.\n\nUntuk memahaminya lebih dalam, coba perhatikan bagaimana data dan fungsi dikelompokkan bersama. Apakah kamu ingin saya berikan contoh kode sederhana atau analogi kasus nyata?";
        }

        return [
            'answer' => $answer,
            'sources' => $sources,
        ];
    }

    public function generateQuiz(Material $material, ?Topic $topic, int $numberOfQuestions): array
    {
        $questionBank = [
            [
                'topic' => 'Encapsulation',
                'question' => 'Manakah alasan utama penggunaan modifier "private" pada atribut class dalam prinsip Encapsulation?',
                'option_a' => 'Agar atribut dapat diakses secara bebas oleh semua class di luar package',
                'option_b' => 'Untuk mencegah modifikasi data langsung dari luar dan menjaga integritas data',
                'option_c' => 'Untuk mempercepat eksekusi program di compiler',
                'option_d' => 'Agar atribut otomatis diwariskan ke semua child class tanpa batas',
                'correct_answer' => 'B',
                'explanation' => 'Modifier private memastikan data hanya dapat diakses atau diubah melalui method getter dan setter yang terkontrol.',
            ],
            [
                'topic' => 'Inheritance',
                'question' => 'Kata kunci apa yang umumnya digunakan dalam pemrograman berorientasi objek (seperti Java atau PHP) untuk mewarisi superclass?',
                'option_a' => 'implements',
                'option_b' => 'extends',
                'option_c' => 'inherits',
                'option_d' => 'instanceof',
                'correct_answer' => 'B',
                'explanation' => 'Kata kunci "extends" digunakan untuk menunjukkan bahwa suatu class mewarisi atribut dan method dari superclass.',
            ],
            [
                'topic' => 'Polymorphism',
                'question' => 'Apa perbedaan mendasar antara Method Overriding dan Method Overloading?',
                'option_a' => 'Overriding terjadi di class yang sama, sedangkan Overloading terjadi pada child class',
                'option_b' => 'Overriding membutuhkan nama method dan parameter persis sama pada hirarki inheritance, sedangkan Overloading nama sama dengan parameter berbeda dalam satu class',
                'option_c' => 'Overloading hanya berlaku untuk private method',
                'option_d' => 'Overriding ditentukan pada saat compile-time, sedangkan Overloading pada runtime',
                'correct_answer' => 'B',
                'explanation' => 'Overriding menimpa implementasi method parent di child class (runtime polymorphism), sedangkan Overloading adalah method bernama sama dengan signature parameter berbeda (compile-time polymorphism).',
            ],
            [
                'topic' => 'Abstraction',
                'question' => 'Ciri utama dari sebuah Abstract Class adalah:',
                'option_a' => 'Dapat diinstansiasi secara langsung menggunakan operator new',
                'option_b' => 'Tidak dapat diinstansiasi langsung dan berfungsi sebagai kerangka dasar bagi subclass',
                'option_c' => 'Tidak boleh memiliki method konkrit yang memiliki body',
                'option_d' => 'Hanya boleh memiliki atribut dengan tipe data primitif',
                'correct_answer' => 'B',
                'explanation' => 'Abstract Class tidak dapat dibuat objeknya secara langsung, melainkan harus diturunkan oleh subclass yang mengimplementasikan method abstract-nya.',
            ],
            [
                'topic' => 'Encapsulation',
                'question' => 'Pasangan method yang digunakan untuk membaca dan memperbarui atribut private disebut:',
                'option_a' => 'Input dan Output method',
                'option_b' => 'Getter dan Setter method',
                'option_c' => 'Constructor dan Destructor',
                'option_d' => 'Overload dan Override',
                'correct_answer' => 'B',
                'explanation' => 'Getter (accessor) digunakan untuk membaca nilai atribut private, sedangkan Setter (mutator) digunakan untuk mengubah nilai secara terkontrol.',
            ],
            [
                'topic' => 'Polymorphism',
                'question' => 'Jika class Kucing dan class Anjing sama-sama meng-override method bersuara() dari class Hewan, prinsip apa yang sedang diterapkan?',
                'option_a' => 'Enkapsulasi data',
                'option_b' => 'Polimorfisme dinamis (Runtime Polymorphism)',
                'option_c' => 'Normalisasi database',
                'option_d' => 'Multiple Inheritance',
                'correct_answer' => 'B',
                'explanation' => 'Kemampuan method bersuara() menghasilkan perilaku berbeda sesuai objek spesifiknya saat runtime adalah wujud Runtime Polymorphism.',
            ],
            [
                'topic' => 'Inheritance',
                'question' => 'Modifier manakah yang mengizinkan atribut diakses oleh class itu sendiri dan class turunannya, tetapi TIDAK dari luar class?',
                'option_a' => 'public',
                'option_b' => 'private',
                'option_c' => 'protected',
                'option_d' => 'default',
                'correct_answer' => 'C',
                'explanation' => 'Modifier protected memberikan hak akses khusus kepada class itu sendiri dan seluruh subclass (turunannya).',
            ],
            [
                'topic' => 'Abstraction',
                'question' => 'Perbedaan utama antara Interface dan Abstract Class pada PBO tradisional adalah:',
                'option_a' => 'Interface hanya berisi konstanta dan deklarasi method tanpa implementasi (semua abstract)',
                'option_b' => 'Abstract Class tidak boleh memiliki constructor',
                'option_c' => 'Satu class hanya boleh mengimplementasikan satu Interface saja',
                'option_d' => 'Interface dapat diinstansiasi langsung dengan keyword new',
                'correct_answer' => 'A',
                'explanation' => 'Secara konsep murni, Interface adalah kontrak perilaku (contract) yang seluruh method-nya abstrak dan publik.',
            ],
            [
                'topic' => 'Encapsulation',
                'question' => 'Di antara opsi berikut, manakah contoh penerapan Encapsulation yang BENAR?',
                'option_a' => 'public int saldo; (diakses langsung dari class lain)',
                'option_b' => 'private int saldo; public int getSaldo() { return saldo; }',
                'option_c' => 'static void main() { int saldo = 1000; }',
                'option_d' => 'class Bank extends Saldo {}',
                'correct_answer' => 'B',
                'explanation' => 'Menyimpan atribut sebagai private dan menyediakan public getter adalah implementasi standar enkapsulasi.',
            ],
            [
                'topic' => 'Polymorphism',
                'question' => 'Kapan terjadi Compile-time Polymorphism (Static Polymorphism)?',
                'option_a' => 'Saat program sedang dijalankan oleh user',
                'option_b' => 'Saat kompilasi melalui mekanisme Method Overloading',
                'option_c' => 'Saat memanggil method abstract pada child class',
                'option_d' => 'Saat class di-garbage collect oleh runtime engine',
                'correct_answer' => 'B',
                'explanation' => 'Method Overloading ditentukan oleh compiler pada saat compile-time berdasarkan signature dan jumlah parameter yang dikirim.',
            ],
        ];

        // Filter by topic name if specified
        if ($topic) {
            $filtered = array_filter($questionBank, function ($q) use ($topic) {
                return strtolower($q['topic']) === strtolower($topic->name);
            });
            if (!empty($filtered)) {
                $questionBank = array_values($filtered);
            }
        }

        // Return requested number of questions
        $selected = [];
        $totalAvailable = count($questionBank);
        for ($i = 0; $i < $numberOfQuestions; $i++) {
            $selected[] = $questionBank[$i % $totalAvailable];
        }

        return $selected;
    }

    public function analyzeQuizResult(QuizAttempt $attempt): array
    {
        $attempt->load(['answers.question.topic']);
        $strengths = [];
        $weaknesses = [];

        foreach ($attempt->answers as $ans) {
            $topicName = $ans->question->topic->name ?? 'Konsep Dasar';
            if ($ans->is_correct) {
                if (!in_array($topicName, $strengths)) {
                    $strengths[] = $topicName;
                }
            } else {
                if (!in_array($topicName, $weaknesses)) {
                    $weaknesses[] = $topicName;
                }
            }
        }

        // If no weaknesses detected, give positive note
        if (empty($weaknesses)) {
            $analysis = "Luar biasa! Kamu memahami semua konsep pada kuis ini dengan sempurna.";
        } else {
            $weaknessList = implode(', ', $weaknesses);
            $analysis = "Analisis diagnostik Nalar menunjukkan bahwa kamu perlu memperkuat pemahaman pada konsep: {$weaknessList}.";
        }

        return [
            'strengths' => $strengths,
            'weaknesses' => $weaknesses,
            'analysis' => $analysis,
        ];
    }

    public function generateLearningRecommendation(string $studentKey, Collection $topicProgresses): array
    {
        if ($topicProgresses->isEmpty()) {
            return [
                'topic_id' => null,
                'reason' => 'Selesaikan kuis diagnostik pertama agar Nalar dapat menganalisis kelemahan belajarmu.',
                'priority' => 'medium',
            ];
        }

        // Find the topic with the lowest mastery score
        $sorted = $topicProgresses->sortBy('mastery');
        $lowest = $sorted->first();

        $topicName = $lowest->topic->name ?? 'Topik Belajar';
        $mastery = round($lowest->mastery);

        if ($mastery < 50) {
            $priority = 'high';
            $reason = "Prioritas Tinggi: Penguasaan kamu pada {$topicName} baru mencapai {$mastery}%. Konsep ini merupakan fondasi penting dalam PBO yang perlu diperdalam melalui AI Tutor.";
        } elseif ($mastery < 75) {
            $priority = 'medium';
            $reason = "Prioritas Menengah: Penguasaan kamu pada {$topicName} berada di tingkat {$mastery}%. Disarankan untuk mengulang latihan soal agar mencapai tingkat mahir.";
        } else {
            $priority = 'low';
            $reason = "Siap Melangkah: Penguasaan pada {$topicName} sudah baik ({$mastery}%). Kamu siap melanjutkan ke konsep yang lebih tinggi.";
        }

        return [
            'topic_id' => $lowest->topic_id,
            'reason' => $reason,
            'priority' => $priority,
        ];
    }
}
