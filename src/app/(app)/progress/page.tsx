"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { getKnowledgeProfile } from "@/lib/api/client";
import { KnowledgeProfile } from "@/lib/api/types";

export default function ProgressPage() {
  const [profile, setProfile] = useState<KnowledgeProfile | null>(null);

  useEffect(() => {
    getKnowledgeProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.warn("Failed to fetch knowledge profile:", err));
  }, []);

  const overallMastery = profile?.overall_mastery ?? 68;
  const masteredCount = profile?.mastered_topics_count ?? 2;
  const totalTopics = profile?.topics_count ?? 4;
  const targetTopics = Math.max(0, totalTopics - masteredCount);

  const fallbackTopics = [
    { id: 1, topic_id: 1, name: "Encapsulation", mastery: 90, status: "Dikuasai" as const, attempt_count: 3, correct_count: 9, description: "", last_attempt_at: null },
    { id: 2, topic_id: 2, name: "Inheritance", mastery: 85, status: "Dikuasai" as const, attempt_count: 2, correct_count: 6, description: "", last_attempt_at: null },
    { id: 3, topic_id: 3, name: "Polymorphism", mastery: 40, status: "Perlu Latihan" as const, attempt_count: 2, correct_count: 2, description: "", last_attempt_at: null },
    { id: 4, topic_id: 4, name: "Abstraction", mastery: 55, status: "Cukup" as const, attempt_count: 2, correct_count: 3, description: "", last_attempt_at: null },
  ];

  const topics = (profile?.topics && profile.topics.length > 0) ? profile.topics : fallbackTopics;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Knowledge Profile
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Pantau tingkat penguasaanmu di setiap topik materi perkuliahan berdasarkan evaluasi backend.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {[
          { label: "Rata-rata Penguasaan", value: `${Math.round(overallMastery)}%` },
          { label: "Topik Dikuasai", value: masteredCount.toString() },
          { label: "Target Belajar", value: `${targetTopics} Topik` }
        ].map((stat, idx) => (
          <div key={idx} style={{ padding: 20, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FBFBFA", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#787774", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#191919" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Topic Mastery List */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#191919", marginBottom: 16 }}>Rincian Topik: Pemrograman Berorientasi Objek</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topics.map((topic, idx) => (
            <motion.div
              key={topic.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{ padding: 20, borderRadius: 12, border: "1px solid #E9E9E7", background: "#FFFFFF", display: "flex", alignItems: "center", gap: 24 }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 10, background: "#F7F6F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <BookOpen size={20} color="#191919" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#191919" }}>{topic.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: topic.mastery >= 75 ? "#059669" : topic.mastery >= 50 ? "#D97706" : "#DC2626" }}>
                    {topic.mastery}% ({topic.status})
                  </span>
                </div>
                <div style={{ width: "100%", height: 8, background: "#F7F6F3", borderRadius: 4, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.mastery}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + idx * 0.05 }}
                    style={{ height: "100%", background: topic.mastery >= 75 ? "#059669" : topic.mastery >= 50 ? "#F59E0B" : "#191919", borderRadius: 4 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
