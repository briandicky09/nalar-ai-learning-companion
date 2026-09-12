"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle2, FileText, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ExamPage() {
  const [examState, setExamState] = useState<"intro" | "playing" | "finished">("intro");
  const [answer, setAnswer] = useState("");

  return (
    <div className="max-w-4xl w-full mx-auto pb-12 flex flex-col min-h-[80vh]">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E9E9E7]">
        <Link href="/dashboard" className="flex items-center gap-2 text-[#787774] hover:text-[#191919] transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        {examState === "playing" && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] rounded-lg text-sm font-semibold shadow-sm">
            <Clock size={16} /> 59:59
          </div>
        )}
      </div>

      {examState === "intro" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="w-20 h-20 bg-[#FBFBFA] border border-[#E9E9E7] rounded-2xl flex items-center justify-center text-[#191919] mb-8 shadow-sm">
            <FileText size={32} strokeWidth={1.5} />
          </div>

          <h1 className="text-3xl font-bold text-[#191919] mb-4">
            Ujian Akhir Modul
          </h1>

          <p className="text-[#787774] text-[15px] max-w-md leading-relaxed mb-8">
            Ujian ini akan mengukur pemahaman komprehensif Anda tentang materi yang telah dipelajari. Terdiri dari soal esai dan pilihan ganda.
          </p>

          <div className="flex items-center justify-center gap-6 mb-12 text-[#55534E] text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} /> Waktu: 60 Menit
            </div>
            <div className="flex items-center gap-2">
              <FileText size={16} /> Jumlah Soal: 20
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} /> Mode Ketat (Proctored)
            </div>
          </div>

          <button
            onClick={() => setExamState("playing")}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#191919] text-white font-medium rounded-lg hover:bg-[#2F3437] transition-all active:scale-95 shadow-sm text-lg"
          >
            Mulai Ujian Sekarang
          </button>
        </motion.div>
      )}

      {examState === "playing" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#191919]">Soal Esai 1/5</h2>
            <div className="text-sm font-medium text-[#787774]">Bobot: 20 Poin</div>
          </div>

          <div className="p-6 bg-white border border-[#E9E9E7] rounded-xl shadow-sm">
            <p className="text-[#191919] text-base leading-relaxed mb-6 font-medium">
              Jelaskan konsep Polymorphism dalam Pemrograman Berorientasi Objek beserta contoh kasus nyata implementasinya dalam aplikasi e-commerce!
            </p>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Tuliskan jawaban Anda di sini..."
              className="w-full h-48 p-4 bg-[#FBFBFA] border border-[#DFDFDE] rounded-lg focus:outline-none focus:border-[#191919] resize-none text-[15px]"
            ></textarea>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button className="px-6 py-2.5 border border-[#DFDFDE] text-[#55534E] font-medium rounded-lg hover:bg-[#FBFBFA] transition-colors">
              Sebelumnya
            </button>
            <button
              onClick={() => setExamState("finished")}
              className="px-6 py-2.5 bg-[#191919] text-white font-medium rounded-lg hover:bg-[#2F3437] transition-colors"
            >
              Kumpulkan Ujian
            </button>
          </div>
        </motion.div>
      )}

      {examState === "finished" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="w-24 h-24 bg-[#D1FAE5] rounded-full flex items-center justify-center text-[#059669] mb-8 shadow-sm">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-bold text-[#191919] mb-4">
            Ujian Selesai!
          </h2>

          <p className="text-[#787774] text-base max-w-md leading-relaxed mb-8">
            Jawaban Anda telah berhasil dikirim. AI Nalar sedang mengevaluasi jawaban esai Anda dan hasilnya akan segera tersedia.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-[#191919] text-[#191919] font-medium rounded-lg hover:bg-[#FBFBFA] transition-all active:scale-95"
          >
            Kembali ke Dashboard
          </Link>
        </motion.div>
      )}
    </div>
  );
}
