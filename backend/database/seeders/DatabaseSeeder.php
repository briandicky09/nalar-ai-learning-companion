<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\LearningRecommendation;
use App\Models\Material;
use App\Models\MaterialChunk;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\StudentTopicProgress;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $studentKey = 'demo-student';

        // 1. Create Demo Material
        $filePath = 'materials/pbo_dasar_demo.pdf';
        // Ensure dummy file exists in storage for completeness
        if (!Storage::disk('local')->exists($filePath)) {
            Storage::disk('local')->put($filePath, "%PDF-1.4\n%Demo PDF File for Nalar AI Learning Companion\n%%EOF");
        }

        $material = Material::create([
            'student_key' => $studentKey,
            'title' => 'Pemrograman Berorientasi Objek Dasar',
            'original_filename' => 'Pertemuan_1_4_PBO_Dasar.pdf',
            'file_path' => $filePath,
            'file_type' => 'pdf',
            'file_size' => 2450000,
            'processing_status' => 'completed',
        ]);

        // 2. Create Material Chunks
        $chunks = [
            [
                'material_id' => $material->id,
                'chunk_index' => 1,
                'page_number' => 1,
                'content' => "Bab 1: Konsep Dasar PBO dan Class Object. Pemrograman Berorientasi Objek (PBO) adalah paradigma pemrograman yang berorientasikan kepada objek. Class merupakan rancangan cetak biru (blueprint) yang mendefinisikan atribut dan method.",
            ],
            [
                'material_id' => $material->id,
                'chunk_index' => 2,
                'page_number' => 5,
                'content' => "Bab 2: Encapsulation. Enkapsulasi adalah pembungkusan data internal dan pemblokiran akses langsung dari luar class menggunakan modifier private. Komunikasi atribut dilakukan melalui method public Getter dan Setter.",
            ],
            [
                'material_id' => $material->id,
                'chunk_index' => 3,
                'page_number' => 12,
                'content' => "Bab 3: Inheritance (Pewarisan). Mekanisme di mana sebuah subclass mewarisi sifat dan perilaku dari superclass menggunakan kata kunci extends. Mendukung reusabilitas kode dan hierarki klasifikasi.",
            ],
            [
                'material_id' => $material->id,
                'chunk_index' => 4,
                'page_number' => 18,
                'content' => "Bab 4: Polymorphism dan Abstraction. Polymorphism mengizinkan satu antarmuka menjalankan tindakan berbeda lewat Overloading (compile-time) dan Overriding (runtime). Abstraction menyembunyikan detail teknis menggunakan abstract class dan interface.",
            ],
        ];

        foreach ($chunks as $chunkData) {
            MaterialChunk::create($chunkData);
        }

        // 3. Create Topics
        $topicsData = [
            [
                'name' => 'Encapsulation',
                'description' => 'Pembungkusan data dan method dalam class serta pengendalian akses private/public.',
                'order' => 1,
                'mastery' => 90.0,
                'attempts' => 3,
                'correct' => 9,
            ],
            [
                'name' => 'Inheritance',
                'description' => 'Pewarisan atribut dan perilaku dari superclass ke subclass.',
                'order' => 2,
                'mastery' => 85.0,
                'attempts' => 2,
                'correct' => 6,
            ],
            [
                'name' => 'Polymorphism',
                'description' => 'Kemampuan objek untuk memiliki beragam bentuk melalui overriding dan overloading.',
                'order' => 3,
                'mastery' => 40.0,
                'attempts' => 2,
                'correct' => 2,
            ],
            [
                'name' => 'Abstraction',
                'description' => 'Penyembunyian kompleksitas menggunakan abstract class dan interface.',
                'order' => 4,
                'mastery' => 55.0,
                'attempts' => 2,
                'correct' => 3,
            ],
        ];

        $createdTopics = [];
        foreach ($topicsData as $tData) {
            $topic = Topic::create([
                'material_id' => $material->id,
                'name' => $tData['name'],
                'description' => $tData['description'],
                'order' => $tData['order'],
            ]);

            $createdTopics[$tData['name']] = $topic;

            // Seed Student Topic Progress
            StudentTopicProgress::create([
                'student_key' => $studentKey,
                'topic_id' => $topic->id,
                'mastery' => $tData['mastery'],
                'attempt_count' => $tData['attempts'],
                'correct_count' => $tData['correct'],
                'last_attempt_at' => now()->subHours(2),
            ]);
        }

        // 4. Create Sample Diagnostic Quiz
        $quiz = Quiz::create([
            'material_id' => $material->id,
            'topic_id' => null,
            'title' => 'Kuis Diagnostik Fondasi PBO',
            'total_questions' => 5,
        ]);

        $sampleQuestions = [
            [
                'topic_name' => 'Encapsulation',
                'question' => 'Mengapa atribut dianjurkan dideklarasikan dengan modifier private pada prinsip Encapsulation?',
                'option_a' => 'Agar atribut dapat diakses langsung oleh fungsi di luar class',
                'option_b' => 'Untuk mencegah modifikasi data secara sembarangan dan menjaga integritas data internal',
                'option_c' => 'Agar otomatis menjadi variabel global',
                'option_d' => 'Untuk menghemat memori komputer',
                'correct_answer' => 'B',
                'explanation' => 'Modifier private mencegah akses langsung sehingga perubahan nilai atribut harus melewati method validasi (Setter).',
            ],
            [
                'topic_name' => 'Inheritance',
                'question' => 'Kata kunci apa yang digunakan sebuah class untuk mewarisi class induk di Java/PHP?',
                'option_a' => 'implements',
                'option_b' => 'extends',
                'option_c' => 'inherits',
                'option_d' => 'parent',
                'correct_answer' => 'B',
                'explanation' => 'Kata kunci extends mendefinisikan hubungan inheritance antar class.',
            ],
            [
                'topic_name' => 'Polymorphism',
                'question' => 'Manakah yang merupakan karakteristik utama dari Method Overriding?',
                'option_a' => 'Method berada pada class yang sama dengan jumlah parameter berbeda',
                'option_b' => 'Method pada subclass memiliki nama dan parameter yang persis sama dengan method superclass',
                'option_c' => 'Hanya bisa diterapkan pada constructor',
                'option_d' => 'Ditentukan saat proses kompilasi kode (compile-time)',
                'correct_answer' => 'B',
                'explanation' => 'Overriding adalah penimpaan implementasi method superclass oleh subclass dengan nama dan signature yang sama.',
            ],
            [
                'topic_name' => 'Polymorphism',
                'question' => 'Jika method cetak() dipanggil dan mengeksekusi perilaku yang berbeda bergantung pada tipe objek nyata saat runtime, ini disebut:',
                'option_a' => 'Compile-time Overloading',
                'option_b' => 'Runtime Polymorphism (Dynamic Binding)',
                'option_c' => 'Data Hiding',
                'option_d' => 'Tipe Data Primitif',
                'correct_answer' => 'B',
                'explanation' => 'Runtime Polymorphism menentukan eksekusi method saat program berjalan berdasarkan tipe objek aslinya.',
            ],
            [
                'topic_name' => 'Abstraction',
                'question' => 'Perbedaan mendasar antara Abstract Class dan Interface adalah:',
                'option_a' => 'Interface dapat diinstansiasi langsung, sedangkan Abstract Class tidak',
                'option_b' => 'Abstract Class dapat memiliki method konkrit (berisi implementasi), sedangkan Interface tradisional hanya berisi deklarasi method',
                'option_c' => 'Interface tidak boleh memiliki konstanta',
                'option_d' => 'Abstract Class tidak dapat memiliki atribut',
                'correct_answer' => 'B',
                'explanation' => 'Abstract class dapat menggabungkan method abstract dan method yang sudah diimplementasikan (konkrit).',
            ],
        ];

        $createdQuestions = [];
        foreach ($sampleQuestions as $sq) {
            $qTopic = $createdTopics[$sq['topic_name']] ?? null;
            $createdQuestions[] = Question::create([
                'quiz_id' => $quiz->id,
                'topic_id' => $qTopic?->id,
                'question' => $sq['question'],
                'option_a' => $sq['option_a'],
                'option_b' => $sq['option_b'],
                'option_c' => $sq['option_c'],
                'option_d' => $sq['option_d'],
                'correct_answer' => $sq['correct_answer'],
                'explanation' => $sq['explanation'],
            ]);
        }

        // 5. Create Sample Quiz Attempt (Score: 60%)
        // 3 correct (questions 0, 1, 4), 2 incorrect (questions 2, 3 - Polymorphism)
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_key' => $studentKey,
            'score' => 60.00,
            'total_questions' => 5,
            'correct_answers' => 3,
            'completed_at' => now()->subHours(2),
        ]);

        $answerSelections = [
            ['q_idx' => 0, 'sel' => 'B', 'ok' => true],
            ['q_idx' => 1, 'sel' => 'B', 'ok' => true],
            ['q_idx' => 2, 'sel' => 'A', 'ok' => false], // Wrong on Polymorphism
            ['q_idx' => 3, 'sel' => 'A', 'ok' => false], // Wrong on Polymorphism
            ['q_idx' => 4, 'sel' => 'B', 'ok' => true],
        ];

        foreach ($answerSelections as $ans) {
            Answer::create([
                'quiz_attempt_id' => $attempt->id,
                'question_id' => $createdQuestions[$ans['q_idx']]->id,
                'selected_answer' => $ans['sel'],
                'is_correct' => $ans['ok'],
            ]);
        }

        // 6. Create Seeded Learning Recommendation (Prioritize Polymorphism)
        $polymorphismTopic = $createdTopics['Polymorphism'];
        LearningRecommendation::create([
            'student_key' => $studentKey,
            'topic_id' => $polymorphismTopic->id,
            'reason' => 'Prioritas Tinggi: Penguasaan kamu pada Polymorphism baru mencapai 40%. Analisis kuis terakhir menunjukkan kamu kesulitan membedakan Overriding dan Overloading. Pelajari kembali materi ini bersama AI Tutor.',
            'priority' => 'high',
            'status' => 'active',
        ]);
    }
}
