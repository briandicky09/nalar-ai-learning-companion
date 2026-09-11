"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, Target, CheckCircle2, BookOpen, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getDashboard } from "@/lib/api/client";
import { DashboardData } from "@/lib/api/types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getDashboard()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch dashboard from backend:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalMaterials = data?.stats?.total_materials ?? 0;
  const averageScore = data?.stats?.average_score ?? 0;
  const overallMastery = data?.stats?.overall_mastery ?? 0;
  const totalAttempts = data?.stats?.total_quiz_attempts ?? 0;
  const studyHours = totalAttempts > 0 ? (totalAttempts * 0.5).toFixed(1) : "0";

  const stats = [
    { label: "Materi Dipelajari", value: totalMaterials.toString(), icon: FileText },
    { label: "Waktu Belajar", value: `${studyHours} jam`, icon: Clock },
    { label: "Skor Rata-rata", value: averageScore.toString(), icon: Target },
    { label: "Akurasi Kuis", value: `${overallMastery}%`, icon: CheckCircle2 },
  ];

  const recentMaterials = data?.recent_materials || [];
  const recommendation = data?.recommendation;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Beranda
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
            Selamat datang kembali. Mulai belajar dari sini.
          </p>
          {loading && (
            <span style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>
              (Memuat data...)
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 16,
              borderRadius: 12,
              border: "1px solid #E9E9E7",
              background: "#FBFBFA",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <stat.icon size={15} color="#787774" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#787774", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {stat.label}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#191919" }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {/* Recent Materials */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 20,
            borderRadius: 12,
            border: "1px solid #E9E9E7",
            background: "#FBFBFA",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#191919" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={18} />
              <h2 style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Materi Terbaru</h2>
            </div>
            <Link href="/upload" style={{ fontSize: 12, color: "#787774", textDecoration: "none" }} className="hover:text-[#191919]">
              Lihat Semua →
            </Link>
          </div>

          {recentMaterials.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {recentMaterials.map((mat) => (
                <div
                  key={mat.id}
                  style={{
                    padding: 14,
                    background: "#FFFFFF",
                    borderRadius: 8,
                    border: "1px solid #E9E9E7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FileText size={18} color="#191919" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#191919" }}>{mat.title}</div>
                      <div style={{ fontSize: 11, color: "#787774" }}>
                        {(mat.file_size / 1024 / 1024).toFixed(1)} MB • {mat.topics_count || 0} Topik
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: "#D1FAE5", color: "#059669" }}>
                    Selesai
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 16px",
                border: "1px dashed #DFDFDE",
                borderRadius: 8,
                background: "#FFFFFF",
                textAlign: "center",
                gap: 8,
              }}
            >
              <FileText size={28} color="#DFDFDE" />
              <p style={{ fontSize: 13, fontWeight: 500, color: "#191919", margin: 0 }}>Belum ada materi</p>
              <p style={{ fontSize: 12, color: "#787774", margin: 0, maxWidth: 200 }}>
                Unggah materi PDF untuk mulai belajar dan dianalisis oleh AI.
              </p>
            </div>
          )}
        </motion.div>

        {/* Learning Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 20,
            borderRadius: 12,
            border: "1px solid #E9E9E7",
            background: "#FBFBFA",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#191919" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={18} />
              <h2 style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>Rekomendasi Belajar</h2>
            </div>
            <Link href="/recommendations" style={{ fontSize: 12, color: "#787774", textDecoration: "none" }} className="hover:text-[#191919]">
              Rincian →
            </Link>
          </div>

          {recommendation ? (
            <div
              style={{
                padding: 16,
                background: "#FFFFFF",
                borderRadius: 8,
                border: "1px solid #E9E9E7",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, background: "#FEF2F2", color: "#B91C1C", letterSpacing: "0.05em" }}>
                  {recommendation.priority === 'high' ? 'Prioritas Tinggi' : 'Prioritas Menengah'}
                </span>
                <span style={{ fontSize: 12, color: "#787774", fontWeight: 500 }}>
                  Topik: {recommendation.topic_name}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#55534E", margin: 0, lineHeight: 1.5 }}>
                {recommendation.reason}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <Link
                  href="/ai-tutor"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#191919",
                    textDecoration: "none",
                  }}
                  className="hover:underline"
                >
                  <Sparkles size={14} /> Pelajari di AI Tutor <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 16px",
                border: "1px dashed #DFDFDE",
                borderRadius: 8,
                background: "#FFFFFF",
                textAlign: "center",
                gap: 8,
              }}
            >
              <Target size={28} color="#DFDFDE" />
              <p style={{ fontSize: 13, fontWeight: 500, color: "#191919", margin: 0 }}>Data belum cukup</p>
              <p style={{ fontSize: 12, color: "#787774", margin: 0, maxWidth: 200 }}>
                Selesaikan kuis diagnostik agar AI dapat memberikan rekomendasi.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
