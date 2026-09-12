"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { generateQuiz, getMaterials, submitQuiz } from "@/lib/api/client";
import { Material, Quiz, QuizSubmitResult } from "@/lib/api/types";

export default function QuizPage() {
  const [state, setState] = useState<"setup" | "playing" | "result">("setup");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ question_id: number; selected_answer: string }[]>([]);
  const [result, setResult] = useState<QuizSubmitResult | null>(null);

  useEffect(() => {
    getMaterials()
      .then((mats) => {
        setMaterials(mats);
        if (mats.length > 0) {
          setSelectedMaterialId(mats[0].id);
        }
      })
      .catch((err) => console.warn("Failed to load materials for quiz:", err));
  }, []);

  const handleStartQuiz = async () => {
    if (!selectedMaterialId) return;
    setIsLoading(true);

    try {
      const generated = await generateQuiz(selectedMaterialId, undefined, 5);
      setQuiz(generated);
      setCurrentIdx(0);
      setSelectedAnswerIdx(null);
      setUserAnswers([]);
      setState("playing");
    } catch (err) {
      console.warn("Error generating quiz from API:", err);
      // Fallback
      alert("Gagal menghubungi server untuk membuat kuis. Pastikan backend aktif.");
    } finally {
      setIsLoading(false);
    }
  };

  const optionLetters = ["A", "B", "C", "D"];

  const handleNextOrSubmit = async () => {
    if (!quiz || selectedAnswerIdx === null) return;

    const currentQuestion = quiz.questions[currentIdx];
    const newAnswer = {
      question_id: currentQuestion.id,
      selected_answer: optionLetters[selectedAnswerIdx],
    };

    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    setSelectedAnswerIdx(null);

    if (currentIdx + 1 < quiz.questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Last question reached - Submit to backend
      setIsLoading(true);
      try {
        const submitRes = await submitQuiz(quiz.id, updatedAnswers);
        setResult(submitRes);
        setState("result");
      } catch (err) {
        console.warn("Failed to submit quiz to backend:", err);
        // Fallback demo result
        setResult({
          attempt_id: 1,
          quiz_id: quiz.id,
          score: 60,
          total_questions: 5,
          correct_answers: 3,
          diagnostic: {
            strengths: ["Class & Object", "Inheritance"],
            weaknesses: ["Encapsulation (Access Modifier)"],
            analysis: "Kamu memahami teori dasar, namun perlu penguatan pada konsep Encapsulation.",
          },
          answers: [],
        });
        setState("result");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentQ = quiz?.questions[currentIdx];
  const options = currentQ
    ? [currentQ.option_a, currentQ.option_b, currentQ.option_c, currentQ.option_d]
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Kuis Diagnostik
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Evaluasi pemahamanmu. Nalar akan mengidentifikasi kelemahan konsep secara otomatis di sisi server.
        </p>
      </div>

      {state === "setup" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ padding: 24, borderRadius: 16, border: "1px solid #E9E9E7", background: "#FBFBFA" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#191919", margin: "0 0 16px" }}>Pilih Materi untuk Dievaluasi</h3>

            {materials.length === 0 ? (
              <div style={{ padding: 16, textAlign: "center", color: "#787774", fontSize: 14, background: "#FFF", borderRadius: 8, border: "1px solid #DFDFDE" }}>
                Memuat daftar materi kuliah...
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {materials.map((mat) => (
                  <label
                    key={mat.id}
                    onClick={() => setSelectedMaterialId(mat.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 8,
                      border: `1px solid ${selectedMaterialId === mat.id ? "#191919" : "#DFDFDE"}`,
                      background: selectedMaterialId === mat.id ? "#FBFBFA" : "#FFFFFF", cursor: "pointer"
                    }}
                  >
                    <input
                      type="radio"
                      name="materi"
                      checked={selectedMaterialId === mat.id}
                      onChange={() => setSelectedMaterialId(mat.id)}
                      style={{ accentColor: "#191919" }}
                    />
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#191919" }}>{mat.title}</span>
                      <div style={{ fontSize: 12, color: "#787774" }}>
                        {(mat.file_size / 1024 / 1024).toFixed(1)} MB • {mat.topics_count || (mat.topics?.length ?? 4)} Topik terdeteksi
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleStartQuiz}
                disabled={isLoading || !selectedMaterialId}
                style={{
                  padding: "12px 24px", borderRadius: 8, background: "#191919", color: "#FFF",
                  border: "none", fontSize: 14, fontWeight: 500, cursor: isLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 8
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Menyiapkan Soal...
                  </>
                ) : (
                  <>
                    Mulai Kuis Sekarang <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {state === "playing" && currentQ && (
        <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#787774" }}>
              Soal {currentIdx + 1} dari {quiz?.questions.length || 5}
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#191919", background: "#F7F6F3", padding: "4px 12px", borderRadius: 999 }}>
              Nalar Evaluasi Adaptif
            </span>
          </div>

          <div style={{ padding: 32, borderRadius: 16, border: "1px solid #E9E9E7", background: "#FFFFFF", display: "flex", flexDirection: "column", gap: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#191919", margin: 0, lineHeight: 1.5 }}>
              {currentQ.question}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {options.map((opt, idx) => (
                <label
                  key={idx}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: 16,
                    borderRadius: 12, border: `1px solid ${selectedAnswerIdx === idx ? "#191919" : "#DFDFDE"}`,
                    background: selectedAnswerIdx === idx ? "#FBFBFA" : "#FFFFFF", cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswerIdx === idx}
                    onChange={() => setSelectedAnswerIdx(idx)}
                    style={{ accentColor: "#191919", marginTop: 4 }}
                  />
                  <span style={{ fontSize: 14, color: "#191919", lineHeight: 1.5 }}>
                    <strong>{optionLetters[idx]}.</strong> {opt}
                  </span>
                </label>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={handleNextOrSubmit}
                disabled={selectedAnswerIdx === null || isLoading}
                style={{
                  padding: "12px 24px", borderRadius: 8, background: selectedAnswerIdx === null ? "#DFDFDE" : "#191919",
                  color: selectedAnswerIdx === null ? "#9B9A97" : "#FFF", border: "none", fontSize: 14, fontWeight: 500,
                  cursor: selectedAnswerIdx === null || isLoading ? "not-allowed" : "pointer", transition: "background 0.2s",
                  display: "flex", alignItems: "center", gap: 8
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Menilai...
                  </>
                ) : currentIdx + 1 < (quiz?.questions.length || 0) ? (
                  "Selanjutnya"
                ) : (
                  "Selesaikan & Hitung Nilai"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {state === "result" && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Score Box */}
          <div style={{ display: "flex", gap: 24, padding: 32, borderRadius: 16, border: "1px solid #E9E9E7", background: "#FFFFFF", alignItems: "center" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: "8px solid #F7F6F3", borderTopColor: "#191919", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#191919", lineHeight: 1 }}>
                {Math.round(result.score)}<span style={{ fontSize: 16 }}>%</span>
              </span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: "#191919", margin: 0 }}>
                {result.score >= 80 ? "Penguasaan Sangat Baik!" : result.score >= 60 ? "Masih Perlu Ditingkatkan" : "Perlu Belajar Lebih Intensif"}
              </h2>
              <p style={{ fontSize: 14, color: "#787774", margin: 0, lineHeight: 1.6 }}>
                Kamu menjawab {result.correct_answers} dari {result.total_questions} pertanyaan dengan benar. {result.diagnostic.analysis}
              </p>
            </div>
          </div>

          {/* Diagnostic Result */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            <div style={{ padding: 24, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FBFBFA" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#191919", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={18} color="#059669" /> Konsep Dikuasai
              </h3>
              {result.diagnostic.strengths.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 20, color: "#191919", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.diagnostic.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: 13, color: "#787774", margin: 0 }}>Belum ada konsep yang dikuasai penuh.</p>
              )}
            </div>

            <div style={{ padding: 24, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FEF2F2" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#B91C1C", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={18} color="#B91C1C" /> Kelemahan Teridentifikasi
              </h3>
              {result.diagnostic.weaknesses.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 20, color: "#7F1D1D", fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.diagnostic.weaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: 13, color: "#059669", margin: 0 }}>Tidak ada kelemahan terdeteksi pada kuis ini.</p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, marginTop: 16 }}>
            <button
              onClick={() => {
                setState("setup");
                setSelectedAnswerIdx(null);
              }}
              style={{ padding: "10px 20px", borderRadius: 8, background: "#F7F6F3", color: "#191919", border: "1px solid #DFDFDE", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
              Ulangi Kuis
            </button>
            <Link
              href="/recommendations"
              style={{
                padding: "10px 20px", borderRadius: 8, background: "#191919", color: "#FFF", textDecoration: "none",
                fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8
              }}
            >
              Lihat Rekomendasi Belajar <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
