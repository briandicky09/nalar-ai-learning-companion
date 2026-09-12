"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { askTutor, getMaterials } from "@/lib/api/client";
import { Material, TutorSource } from "@/lib/api/types";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  sources?: TutorSource[];
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Halo! Saya Nalar AI Tutor. Berdasarkan materi yang kamu unggah, ada konsep yang masih membingungkan? Saya siap bantu jelaskan Class, Object, Encapsulation, Inheritance, atau Polymorphism dengan metode Sokratik.",
    },
    {
      role: "user",
      text: "Apa bedanya Class sama Object? Tolong pakai contoh yang gampang dong.",
    },
    {
      role: "ai",
      text: "Tentu! Coba bayangkan **Class** itu seperti *cetak biru (blueprint)* atau cetakan kue. Sedangkan **Object** adalah kue hasil cetakannya.\n\nContoh:\n- **Class**: Mobil (punya rancangan roda, warna, mesin)\n- **Object**: Mobil Ferari merah milikmu, atau Mobil Avanza putih milik ayahmu.\n\nKeduanya dibuat dari konsep 'Mobil' yang sama, tapi wujud aslinya (Object) bisa berbeda-beda. Kira-kira dari contoh ini, bisakah kamu menebak kalau 'Kucing' itu Class atau Object?",
      sources: [{ material_id: 1, page: 5, excerpt: "Bab 1: Konsep Dasar PBO dan Class Object" }]
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | undefined>(undefined);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMaterials()
      .then((mats) => {
        setMaterials(mats);
        if (mats.length > 0) {
          setSelectedMaterialId(mats[0].id);
        }
      })
      .catch((err) => console.warn("Failed to load materials for tutor:", err));
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const response = await askTutor(userText, selectedMaterialId);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response.answer,
          sources: response.sources,
        },
      ]);
    } catch (err: unknown) {
      console.warn("Error calling tutor API:", err);
      // Fallback message
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Maaf, terjadi kendala saat menghubungi server AI. Namun berdasarkan materi PBO, pastikan konsep dasar seperti Encapsulation (pembungkusan) dan Inheritance (pewarisan) sudah kamu pahami dengan baik. Coba tanyakan kembali!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)", maxWidth: 900, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E9E9E7] mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191919] tracking-tight mb-1">
            AI Tutor Sokratik
          </h1>
          <p className="text-sm text-[#787774] m-0">
            Bertanya tentang materi kuliahmu. AI akan membimbingmu menemukan jawaban sendiri berdasarkan materi yang diunggah.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {materials.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] border border-[#E9E9E7] rounded-lg text-xs font-medium text-[#191919]">
              <BookOpen size={14} color="#787774" />
              <select
                value={selectedMaterialId || ""}
                onChange={(e) => setSelectedMaterialId(Number(e.target.value) || undefined)}
                className="bg-transparent border-none outline-none text-xs text-[#191919] cursor-pointer"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title.length > 25 ? m.title.substring(0, 25) + "..." : m.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F6F3] rounded-lg text-xs font-medium text-[#191919]">
            <Sparkles size={16} /> Mode: Sokratik Grounded
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 24, paddingRight: 16 }}>
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-[#E9E9E7]" : "bg-[#191919]"}`}>
              {msg.role === "user" ? <User size={16} color="#191919" /> : <Bot size={16} color="#FFF" />}
            </div>
            <div className={`p-4 rounded-xl max-w-[90%] md:max-w-[80%] text-[13px] md:text-[14px] leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-[#F7F6F3]" : "bg-[#FFFFFF] border border-[#E9E9E7]"}`}>
              {msg.text}

              {/* Source References */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#E9E9E7]/60 flex flex-wrap gap-2">
                  <span className="text-[11px] font-semibold text-[#787774] flex items-center gap-1">
                    <BookOpen size={12} /> Referensi Materi:
                  </span>
                  {msg.sources.map((src, sIdx) => (
                    <span key={sIdx} className="text-[11px] font-medium px-2 py-0.5 bg-[#F7F6F3] text-[#55534E] rounded border border-[#E9E9E7]">
                      Halaman {src.page}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex gap-3 md:gap-4 flex-row items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg shrink-0 flex items-center justify-center bg-[#191919]">
              <Bot size={16} color="#FFF" />
            </div>
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E9E9E7] flex items-center gap-2 text-xs text-[#787774]">
              <Loader2 size={14} className="animate-spin text-[#191919]" />
              <span>Nalar sedang menganalisis materi dan merumuskan jawaban sokratik...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Area */}
      <div style={{ marginTop: 24, position: "relative" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          disabled={isLoading}
          placeholder="Tanya sesuatu atau jawab pertanyaan AI..."
          style={{
            width: "100%", padding: "16px 56px 16px 20px", borderRadius: 12,
            border: "1px solid #DFDFDE", outline: "none", fontSize: 14,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          style={{
            position: "absolute", right: 8, top: 8, bottom: 8, width: 40,
            background: "#191919", borderRadius: 8, border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: isLoading || !inputValue.trim() ? "not-allowed" : "pointer",
            opacity: isLoading || !inputValue.trim() ? 0.6 : 1
          }}
        >
          <Send size={16} color="#FFF" />
        </button>
      </div>
    </div>
  );
}
