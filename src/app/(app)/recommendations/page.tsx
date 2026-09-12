"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, FileText, ArrowRight, Target, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getRecommendations } from "@/lib/api/client";
import { Recommendation } from "@/lib/api/types";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    getRecommendations()
      .then((data) => setRecommendations(data))
      .catch((err) => console.warn("Failed to fetch recommendations:", err));
  }, []);

  const fallbackList = [
    {
      id: 1,
      topic_id: 3,
      topic_name: "Polymorphism",
      title: "Pahami Kembali: Polymorphism & Method Overriding",
      reason: "Prioritas Tinggi",
      score: "Nilai Kuis 40%",
      desc: "Berdasarkan kuis terakhir, penguasaan kamu pada Polymorphism berada di tingkat 40%. Mari ulas kembali perbedaan Overloading dan Overriding dengan Nalar Tutor untuk memperkuat fondasi PBO kamu.",
      action: "Tanya AI Tutor",
      link: "/ai-tutor",
      icon: AlertCircle,
      badgeStyle: "bg-red-50 border border-red-200 text-red-700",
    },
    {
      id: 2,
      topic_id: 4,
      topic_name: "Abstraction",
      title: "Review Konsep: Abstraction & Interface",
      reason: "Prioritas Menengah",
      score: "Nilai Kuis 55%",
      desc: "Penguasaan kamu pada Abstraction berada di angka 55%. Disarankan untuk mengulas kembali perbedaan Abstract Class dan Interface agar siap menghadapi studi kasus lebih kompleks.",
      action: "Latihan Soal Kuis",
      link: "/quiz",
      icon: Target,
      badgeStyle: "bg-amber-50 border border-amber-200 text-amber-700",
    },
    {
      id: 3,
      topic_id: 2,
      topic_name: "Inheritance",
      title: "Lanjut ke Konsep Mahir: Inheritance",
      reason: "Siap Melangkah",
      score: "Nilai Kuis 85%",
      desc: "Penguasaan materi Inheritance kamu sangat baik (85%). Pertahankan pemahaman ini dan lanjutkan ke implementasi relasi antar objek tingkat lanjut.",
      action: "Buka Materi",
      link: "/upload",
      icon: FileText,
      badgeStyle: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    },
  ];

  const displayList = recommendations.length > 0 ? recommendations.map((rec) => ({
    id: rec.id,
    topic_id: rec.topic_id,
    topic_name: rec.topic_name,
    title: `Fokus Belajar: ${rec.topic_name}`,
    reason: rec.priority === 'high' ? 'Prioritas Tinggi' : rec.priority === 'medium' ? 'Prioritas Menengah' : 'Siap Melangkah',
    score: `Topik: ${rec.topic_name}`,
    desc: rec.reason,
    action: "Pelajari di AI Tutor",
    link: "/ai-tutor",
    icon: rec.priority === 'high' ? AlertCircle : PlayCircle,
    badgeStyle: rec.priority === 'high' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-white border border-[#E9E9E7] text-[#191919]',
  })) : fallbackList;

  return (
    <div className="max-w-4xl w-full mx-auto pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#191919] tracking-tight mb-3">
          Rekomendasi Terarah
        </h1>
        <p className="text-[#787774] text-[15px] max-w-2xl leading-relaxed">
          Langkah belajarmu selanjutnya, disusun otomatis oleh AI backend berdasarkan analisis kelemahan dari evaluasi kuis.
        </p>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {displayList.map((rec, idx) => (
          <motion.div
            key={rec.id || idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="group bg-white border border-[#E9E9E7] rounded-xl p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 relative"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">

              {/* Neutral Icon Container */}
              <div className="shrink-0 w-12 h-12 rounded-lg bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center shadow-sm">
                <rec.icon size={20} strokeWidth={2} />
              </div>

              {/* Content Container */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${rec.badgeStyle}`}>
                    {rec.reason}
                  </span>
                  <span className="text-xs font-medium text-[#787774] flex items-center gap-1.5">
                    <Target size={12} /> {rec.score}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#191919] mb-3 truncate">
                  {rec.title}
                </h3>

                <p className="text-[15px] text-[#55534E] leading-relaxed mb-6">
                  {rec.desc}
                </p>

                {/* Action Button */}
                <div className="flex items-center justify-end">
                  <Link
                    href={rec.link}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E9E9E7] hover:bg-[#FBFBFA] text-[#191919] text-sm font-medium rounded-lg transition-colors active:scale-95 shadow-sm"
                  >
                    {rec.action} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
