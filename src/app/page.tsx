"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ChevronDown, Globe, FileText, Target,
  BrainCircuit, Users, ShieldCheck, LineChart,
  BookOpen, Menu, X, CheckCircle2, Search, SlidersHorizontal,
  Sparkles, Zap, Star, Network
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Typewriter effect state
  const words = ["cerdas", "cepat", "fokus", "terarah"];
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleTyping = () => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      } else {
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };
    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]); // words array is static

  return (
    <div className="min-h-screen bg-white text-[#191919] font-sans overflow-x-hidden selection:bg-[#191919] selection:text-white">

      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-[#E9E9E7]/80 shadow-md py-4"
            : "bg-white/40 backdrop-blur-lg border-b border-[#E9E9E7]/40 shadow-sm py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">

          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <img src="/logo-nalar.png" alt="Nalar" className="w-28 h-28 object-contain transition-transform group-hover:scale-105 -my-8 -mx-2" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2" onMouseLeave={() => setActiveDropdown(null)}>
            <div className="relative" onMouseEnter={() => setActiveDropdown('fitur')}>
              <button onClick={() => setActiveDropdown(activeDropdown === 'fitur' ? null : 'fitur')} className="flex items-center gap-1 text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors py-4">
                Fitur <ChevronDown size={16} className={`text-[#9B9A97] transition-transform duration-200 ${activeDropdown === 'fitur' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'fitur' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[340px] bg-white border border-[#E9E9E7] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2"
                  >
                    <Link href="#extraction" onClick={() => setActiveDropdown(null)} className="flex items-start gap-3 p-3 hover:bg-[#F7F6F3] rounded-lg transition-colors group/item">
                      <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] flex items-center justify-center text-[#191919] group-hover/item:bg-white group-hover/item:shadow-sm transition-all shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[#191919] mb-0.5">Ekstrak PDF</div>
                        <div className="text-[13px] text-[#787774]">Otomatis ubah PDF jadi materi interaktif</div>
                      </div>
                    </Link>
                    <Link href="#topic-map" onClick={() => setActiveDropdown(null)} className="flex items-start gap-3 p-3 hover:bg-[#F7F6F3] rounded-lg transition-colors group/item">
                      <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] flex items-center justify-center text-[#191919] group-hover/item:bg-white group-hover/item:shadow-sm transition-all shrink-0">
                        <Network size={20} />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[#191919] mb-0.5">Peta Konsep</div>
                        <div className="text-[13px] text-[#787774]">Visualisasi hubungan antar topik</div>
                      </div>
                    </Link>
                    <Link href="#exam-mode" onClick={() => setActiveDropdown(null)} className="flex items-start gap-3 p-3 hover:bg-[#F7F6F3] rounded-lg transition-colors group/item">
                      <div className="w-10 h-10 rounded-lg bg-[#F7F6F3] flex items-center justify-center text-[#191919] group-hover/item:bg-white group-hover/item:shadow-sm transition-all shrink-0">
                        <BrainCircuit size={20} />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-[#191919] mb-0.5">Ujian Adaptif</div>
                        <div className="text-[13px] text-[#787774]">Simulasi ujian yang menyesuaikan kemampuan</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" onMouseEnter={() => setActiveDropdown('panduan')}>
              <button onClick={() => setActiveDropdown(activeDropdown === 'panduan' ? null : 'panduan')} className="flex items-center gap-1 text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors py-4">
                Panduan <ChevronDown size={16} className={`text-[#9B9A97] transition-transform duration-200 ${activeDropdown === 'panduan' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'panduan' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[220px] bg-white border border-[#E9E9E7] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2"
                  >
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-3 hover:bg-[#F7F6F3] rounded-lg transition-colors text-[15px] font-medium text-[#191919]">Panduan Belajar</Link>
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-3 hover:bg-[#F7F6F3] rounded-lg transition-colors text-[15px] font-medium text-[#191919]">Pusat Bantuan</Link>
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-3 hover:bg-[#F7F6F3] rounded-lg transition-colors text-[15px] font-medium text-[#191919]">Akademi Nalar</Link>
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-3 hover:bg-[#F7F6F3] rounded-lg transition-colors text-[15px] font-medium text-[#191919]">Komunitas</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/dashboard" className="text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors py-4">
              Harga
            </Link>
            <Link href="/dashboard" className="text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors py-4">
              Hubungi Kami
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-medium text-[#191919] hover:text-[#787774] transition-colors">
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-[6px] bg-[#191919] text-white text-[15px] font-medium hover:bg-[#2F3437] transition-all shadow-sm active:scale-95"
            >
              Mulai Gratis
            </Link>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-[#191919]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4 text-[16px] font-medium text-[#191919] mt-4">
              <Link href="#fitur" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 hover:bg-[#F7F6F3] rounded-xl transition-colors">Fitur</Link>
              <Link href="#panduan" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 hover:bg-[#F7F6F3] rounded-xl transition-colors">Panduan</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 hover:bg-[#F7F6F3] rounded-xl transition-colors">Harga</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 hover:bg-[#F7F6F3] rounded-xl transition-colors">Hubungi Kami</Link>

              <div className="h-[1px] bg-[#E9E9E7] my-4 w-full" />

              <div className="flex flex-col gap-4 px-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-3 text-center text-[#787774] hover:text-[#191919] transition-colors">Masuk ke Akun</Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex justify-center items-center w-full py-3.5 rounded-xl bg-[#191919] text-white font-medium shadow-sm hover:scale-[0.98] transition-transform"
                >
                  Mulai Gratis Sekarang
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">

        {/* Minimalist Floating Icons */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }} className="absolute top-32 left-10 md:left-20 text-[#D4D4D4] animate-pulse">
          <Sparkles size={32} strokeWidth={1.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 1 }} className="absolute top-40 right-10 md:right-24 text-[#D4D4D4] animate-bounce" style={{ animationDuration: '4s' }}>
          <Star size={24} strokeWidth={1.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 1 }} className="absolute bottom-60 left-20 md:left-40 text-[#D4D4D4]">
          <Zap size={28} strokeWidth={1.5} />
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 1 }} className="absolute bottom-72 right-12 md:right-32 text-[#D4D4D4]">
          <BrainCircuit size={32} strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-[#191919] leading-[1.2] mb-6 max-w-4xl"
        >
          Belajar{" "}
          <span className="inline-flex items-center bg-[#191919] text-white px-4 md:px-6 rounded-xl md:rounded-2xl min-w-[140px] md:min-w-[240px] min-h-[1.2em] relative align-bottom translate-y-[-0.05em] pb-[0.05em]">
            <span className="relative z-10">{text}</span>
            <span className="animate-pulse relative z-10 font-light -mt-[0.1em]">|</span>
          </span>
          ,<br className="hidden md:block" /> bukan sekadar keras.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-[#787774] max-w-2xl mb-10 leading-relaxed font-medium"
        >
          Nalar mengekstrak PDF kuliah Anda, mendeteksi kelemahan pemahaman,
          dan membimbing Anda secara personal layaknya dosen privat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-[6px] bg-[#191919] text-white text-[16px] font-semibold hover:bg-[#2F3437] transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
          >
            Mulai belajar sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-[6px] bg-white border border-[#E9E9E7] text-[#191919] text-[16px] font-semibold hover:bg-[#FBFBFA] transition-all shadow-sm active:scale-95 flex items-center justify-center"
          >
            Lihat Demo
          </Link>
        </motion.div>

        {/* Hero Illustration Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-24 w-full max-w-5xl relative"
        >
          <div className="absolute -inset-4 bg-[#F7F6F3] rounded-3xl opacity-50 -z-10" />
          <div className="relative rounded-2xl overflow-hidden border border-[#E9E9E7] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] bg-white">
            {/* Mockup Header */}
            <div className="h-12 bg-[#FBFBFA] border-b border-[#E9E9E7] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#E03E3E]" />
                <div className="w-3 h-3 rounded-full bg-[#F5A623]" />
                <div className="w-3 h-3 rounded-full bg-[#0F7B0F]" />
              </div>
              <div className="ml-4 h-6 w-64 bg-white rounded-[4px] border border-[#E9E9E7] flex items-center px-2 text-[11px] text-[#9B9A97]">
                nalar-app.com/study/algoritma
              </div>
            </div>
            {/* Mockup Content */}
            <div className="p-8 md:p-12 text-left flex flex-col md:flex-row gap-8 bg-white">
              <div className="flex-1 space-y-6">
                <div className="h-8 w-3/4 bg-[#F1F1EF] rounded-md animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-[#F7F6F3] rounded" />
                  <div className="h-4 w-full bg-[#F7F6F3] rounded" />
                  <div className="h-4 w-5/6 bg-[#F7F6F3] rounded" />
                </div>
                <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="flex items-center gap-2 mb-3 text-[#191919] font-semibold text-sm">
                    <BrainCircuit size={16} className="text-[#191919]" /> AI Tutor Sokratik
                  </div>
                  <div className="h-4 w-full bg-[#F1F1EF] rounded mb-2" />
                  <div className="h-4 w-2/3 bg-[#F1F1EF] rounded" />
                </div>
              </div>
              <div className="w-full md:w-72 space-y-4">
                <div className="p-5 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="text-xs text-[#787774] font-medium mb-1">Penguasaan Topik</div>
                  <div className="text-2xl font-bold text-[#191919] mb-3">68%</div>
                  <div className="h-2 w-full bg-[#E9E9E7] rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-[#191919] rounded-full" />
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="text-xs font-medium text-[#191919] mb-3 flex items-center justify-between">
                    <span>Kelemahan Terdeteksi</span>
                    <span className="text-[10px] bg-[#E9E9E7] text-[#191919] px-2 py-0.5 rounded font-semibold">Fokus</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-[#E9E9E7] rounded" />
                    <div className="h-3 w-1/2 bg-[#E9E9E7] rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee Social Proof */}
      <section className="border-y border-[#E9E9E7] bg-[#FBFBFA] py-5 overflow-hidden relative z-10">
        <div className="flex items-center whitespace-nowrap opacity-70">
          <div className="flex gap-16 items-center w-max animate-[marquee_30s_linear_infinite]">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <Users size={18} /> <span>10.000+ Mahasiswa aktif</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <Globe size={18} /> <span>Digunakan di 50+ Kampus</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <BookOpen size={18} /> <span>3 Juta+ Halaman PDF diekstrak</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <Target size={18} /> <span>Meningkatkan Retensi hingga 40%</span>
                </div>
                <div className="flex items-center gap-2 text-[#191919] font-medium">
                  <ShieldCheck size={18} /> <span>Privasi Data Terjamin</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Variation Section: Cara Kerja Nalar (Reference Style) */}
      <section id="extraction" className="py-32 px-6 max-w-6xl mx-auto bg-white relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.h2 variants={fadeUp} className="text-xs font-bold tracking-widest text-[#191919] uppercase mb-4">Cara Kerja Nalar</motion.h2>
          <motion.h3 variants={fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-[#191919]">
            Dari PDF ke penguasaan <br className="hidden md:block" /> materi dalam menit.
          </motion.h3>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Step 1 */}
          <motion.div variants={fadeUp} className="bg-white border border-[#E9E9E7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex flex-col h-full group">
            <div className="w-10 h-10 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-8 text-lg font-bold">1</div>

            <div className="mb-8 w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-[#FBFBFA] flex items-center justify-center">
              {/* Minimalist Graphic 1 */}
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#E9E9E7] blur-2xl opacity-50 rounded-full" />
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 opacity-80">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <polyline points="9 15 12 12 15 15"></polyline>
                </svg>
              </div>
            </div>

            <h4 className="text-xl font-bold text-[#191919] mb-3">Unggah Materi</h4>
            <p className="text-[#787774] leading-relaxed text-[15px]">
              Tarik dan lepas PDF, slide kuliah, atau modul belajar. AI kami akan membedah teks, gambar, dan tabel secara instan.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div id="topic-map" variants={fadeUp} className="bg-white border border-[#E9E9E7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex flex-col h-full group">
            <div className="w-10 h-10 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-8 text-lg font-bold">2</div>

            <div className="mb-8 w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-[#FBFBFA] flex items-center justify-center">
              {/* Minimalist Graphic 2 */}
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#E9E9E7] blur-2xl opacity-50 rounded-full" />
                <Network size={64} strokeWidth={1} color="#191919" className="relative z-10 opacity-80" />
              </div>
            </div>

            <h4 className="text-xl font-bold text-[#191919] mb-3">Peta Konsep Terbentuk</h4>
            <p className="text-[#787774] leading-relaxed text-[15px]">
              Nalar secara otomatis membuat pohon pengetahuan, menghubungkan konsep inti yang harus Anda pahami.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div id="exam-mode" variants={fadeUp} className="bg-white border border-[#E9E9E7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow duration-300 flex flex-col h-full group">
            <div className="w-10 h-10 rounded-xl bg-[#FBFBFA] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-8 text-lg font-bold">3</div>

            <div className="mb-8 w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-[#FBFBFA] flex items-center justify-center">
              {/* Minimalist Graphic 3 */}
              <div className="relative group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 bg-[#E9E9E7] blur-2xl opacity-50 rounded-full" />
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 opacity-80">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <path d="M9 9h6"></path>
                  <path d="M9 13h4"></path>
                </svg>
              </div>
            </div>

            <h4 className="text-xl font-bold text-[#191919] mb-3">Evaluasi Sokratik</h4>
            <p className="text-[#787774] leading-relaxed text-[15px]">
              Uji pemahaman Anda melalui mode tanya-jawab adaptif yang memaksa Anda berpikir kritis, bukan menghafal.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Large Features - AI where your team works style */}
      <section id="fitur" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Large Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-[24px] p-8 md:p-12 flex flex-col group overflow-hidden"
          >
            <div className="mb-12">
              <h3 className="text-2xl font-bold tracking-tight text-[#191919] mb-3">
                Evaluasi Mandiri
              </h3>
              <p className="text-[#787774] text-[15px]">
                Uji seberapa jauh Anda memahami materi dengan kuis pintar yang mendeteksi setiap titik buta pengetahuan.
              </p>
            </div>

            <div className="mt-auto bg-white rounded-xl border border-[#E9E9E7] shadow-sm p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded border border-[#E9E9E7] flex items-center justify-center text-[#191919]">
                  <FileText size={16} />
                </div>
                <span className="font-bold text-[#191919]">Kuis Diagnostik</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#E9E9E7] shrink-0" />
                  <div className="h-5 w-3/4 bg-[#F1F1EF] rounded" />
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#191919] flex items-center justify-center bg-[#191919] text-white shrink-0">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="h-5 w-5/6 bg-[#F1F1EF] rounded" />
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-[#E9E9E7] shrink-0" />
                  <div className="h-5 w-2/3 bg-[#F1F1EF] rounded" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Large Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-[24px] p-8 md:p-12 flex flex-col group overflow-hidden"
          >
            <div className="mb-12">
              <h3 className="text-2xl font-bold tracking-tight text-[#191919] mb-3">
                Dosen privat di sakumu
              </h3>
              <p className="text-[#787774] text-[15px]">
                Bertanya pada AI Tutor layaknya berdiskusi dengan manusia. Nalar menjawab berbasis konteks spesifik PDF kuliah Anda.
              </p>
            </div>

            <div className="mt-auto relative w-full aspect-[4/3] rounded-xl border border-[#E9E9E7] shadow-sm bg-white overflow-hidden translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-[#FBFBFA] flex flex-col p-5">
                <div className="flex gap-3 mb-5 opacity-80">
                  <div className="w-6 h-6 rounded-full bg-[#E9E9E7] shrink-0" />
                  <div className="bg-[#F1F1EF] p-3 rounded-lg rounded-tl-none w-3/4 text-[11px] text-[#787774]">
                    Tolong jelaskan ulang konsep polimorfisme, saya masih bingung bedanya dengan inheritance.
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse mb-4">
                  <div className="w-6 h-6 rounded-sm bg-[#191919] shrink-0 text-white flex items-center justify-center text-[10px] font-bold">S</div>
                  <div className="bg-white border border-[#E9E9E7] p-4 rounded-lg rounded-tr-none w-5/6 text-[12px] text-[#191919] leading-relaxed shadow-sm">
                    Mari kita bedah perlahan. Bayangkan sebuah pabrik mobil.
                    <br /><br />
                    Inheritance itu seperti mewarisi cetak biru mesin dari model lama ke model baru.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Small Features - "See what Notion can do" style */}
      <section className="py-24 px-6 border-t border-[#E9E9E7] bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-xl text-[#191919] mb-8 font-bold">Lihat kemampuan magis Nalar</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <Link href="#extraction" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <Search size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Ekstrak PDF otomatis
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

            <Link href="#topic-map" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <BrainCircuit size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Peta Konsep Cerdas
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

            <Link href="/dashboard" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <LineChart size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Knowledge Profile
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

            <Link href="#exam-mode" className="p-6 rounded-xl border border-[#E9E9E7] bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#191919] transition-all group flex flex-col min-h-[160px]">
              <div className="w-10 h-10 rounded-full border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
                <SlidersHorizontal size={18} />
              </div>
              <h4 className="font-bold text-[#191919] text-lg leading-snug mt-auto flex items-center gap-1">
                Mode Ujian Adaptif
                <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h4>
            </Link>

          </div>
        </div>
      </section>

      {/* 1 & 2. Stats & Testimonial Section */}
      <section className="py-24 px-6 w-full relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs font-bold tracking-widest text-[#191919] uppercase mb-4">
          Telah Dipercaya oleh Ratusan Ribu Pelajar
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#191919] mb-4">
          Dampak Nyata Nalar bagi Mahasiswa
        </h2>
        <p className="text-[#787774] text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
          Lebih dari 650.000 pelajar dari berbagai kampus di Indonesia telah membuktikan efektivitas platform kami.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#F1F1EF] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
              <Users size={24} />
            </div>
            <div className="text-4xl font-bold text-[#191919] mb-2">650k+</div>
            <div className="text-sm font-medium text-[#787774]">Pengguna Aktif</div>
          </div>
          {/* Card 2 */}
          <div className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#F1F1EF] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
              <FileText size={24} />
            </div>
            <div className="text-4xl font-bold text-[#191919] mb-2">1.5M+</div>
            <div className="text-sm font-medium text-[#787774]">Catatan Dibuat</div>
          </div>
          {/* Card 3 */}
          <div className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#F1F1EF] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
              <Star size={24} />
            </div>
            <div className="text-4xl font-bold text-[#191919] mb-2">4.9/5</div>
            <div className="text-sm font-medium text-[#787774]">Rating Pengguna</div>
          </div>
          {/* Card 4 */}
          <div className="bg-[#FBFBFA] border border-[#E9E9E7] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#F1F1EF] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-6">
              <BookOpen size={24} />
            </div>
            <div className="text-4xl font-bold text-[#191919] mb-2">1.0k+</div>
            <div className="text-sm font-medium text-[#787774]">Sekolah & Kampus</div>
          </div>
        </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto mt-24">
          <h3 className="text-2xl font-bold text-[#191919] mb-12 text-center">Apa Kata Mereka?</h3>
          <div className="flex overflow-hidden relative w-full">
            <div className="flex gap-6 w-max animate-[marquee_40s_linear_infinite] py-4">
              {[...Array(2)].map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {[
                    { name: "Charlie Hernando", text: "Aplikasi yang bener-bener ngebantu, apalagi buat yang mau belajar dengan deadline H-1. Membuat materi panjang menjadi bagian inti yang bisa dipelajarin. Ada Quiz dan AI yang ngebantu buat yang masih belum paham soal materi." },
                    { name: "Mayla Fazza", text: "Semenjak tau aplikasi ini, nilai aku semakin naik dan aku semakin aktif di kelas. Aplikasi ini punya banyak fitur yang sangat berguna buat pelajar, apalagi bisa diakses gratis. Pokoknya aku cinta banget sama aplikasi ini!" },
                    { name: "Sajiwa Baswara", text: "AI-nya beneran ngebantu banget buat aku yang kuliah ini, apalagi ada kuis yang bikin aku makin paham. Next kalau ada rezeki lagi mau langganan yang 6 bulan buat semester 2!" },
                    { name: "Rina Salsabila", text: "Fitur Peta Konsepnya sangat *game-changer*! Aku bisa melihat gambaran besar dari modul kuliah yang rumit jadi super jelas. Nalar beneran inovasi terbaik buat mahasiswa." }
                  ].map((testimonial, i) => (
                    <div key={i} className="w-[340px] md:w-[400px] shrink-0 bg-[#FBFBFA] border border-[#E9E9E7] p-8 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#191919] text-white flex items-center justify-center font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#191919]">{testimonial.name}</h4>
                          <div className="flex text-[#191919] mt-1 gap-1">
                            {[...Array(5)].map((_, idx) => <Star key={idx} size={14} fill="currentColor" />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-[#55534E] leading-relaxed text-[15px]">
                        "{testimonial.text}"
                      </p>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Comparison Table */}
      <section className="py-24 px-6 border-t border-[#E9E9E7] bg-[#FBFBFA] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#191919] mb-4">Kenapa Nalar?</h2>
            <p className="text-[#787774] text-lg">Bandingin sama platform lain.</p>
          </div>
          
          <div className="bg-white border border-[#E9E9E7] rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 items-center p-6 border-b border-[#E9E9E7] bg-[#FBFBFA]">
              <div className="col-span-6 md:col-span-8"></div>
              <div className="col-span-3 md:col-span-2 text-center text-sm font-semibold text-[#787774]">Situs lain</div>
              <div className="col-span-3 md:col-span-2 text-center text-sm font-bold text-[#191919]">Nalar</div>
            </div>
            
            {[
              "Ubah video YouTube & PDF jadi materi interaktif",
              "Bahasa Indonesia native dengan konteks lokal",
              "Peta Konsep + Kuis + Chat AI dalam satu tempat",
              "Harga pelajar yang sangat terjangkau",
              "Aplikasi mobile tersinkronisasi",
              "Prediksi kelemahan & rekomendasi belajar otomatis"
            ].map((feature, i) => (
              <div key={i} className={`grid grid-cols-12 items-center p-6 ${i !== 5 ? 'border-b border-[#E9E9E7]' : ''} hover:bg-[#FBFBFA] transition-colors`}>
                <div className="col-span-6 md:col-span-8 text-[15px] font-medium text-[#191919]">{feature}</div>
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#F1F1EF] flex items-center justify-center text-[#9B9A97]">
                    <X size={16} strokeWidth={3} />
                  </div>
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#191919] flex items-center justify-center text-white shadow-sm">
                    <CheckCircle2 size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section id="panduan" className="py-24 px-6 border-t border-[#E9E9E7] bg-white relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#191919] mb-4">Pertanyaan Umum</h2>
            <p className="text-[#787774] text-lg">Hal-hal yang sering ditanyakan pengguna baru</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Apa itu Nalar?", a: "Nalar adalah asisten belajar berbasis AI yang dapat mengubah materi kuliah (PDF, PPT, Word) menjadi ringkasan, peta konsep, dan kuis interaktif secara otomatis." },
              { q: "Format file apa saja yang didukung?", a: "Saat ini Nalar mendukung format PDF, DOCX (Word), PPTX (PowerPoint), dan TXT. Kami juga segera menghadirkan fitur konversi tautan YouTube." },
              { q: "Apakah gratis?", a: "Ya, Nalar memiliki paket gratis (Basic) yang bisa langsung Anda gunakan. Untuk fitur lanjutan seperti kuota dokumen lebih banyak dan prioritas AI, kami menyediakan paket Premium dengan harga terjangkau." },
              { q: "Berapa lama proses ekstrak catatan?", a: "Tergantung ukuran file Anda. Biasanya hanya membutuhkan waktu kurang dari 30 detik untuk menghasilkan Peta Konsep dan bahan Kuis." },
              { q: "Apakah ini termasuk kecurangan akademik?", a: "Tidak. Nalar tidak membuatkan esai atau tugas untuk Anda. Nalar dirancang menggunakan metode Sokratik untuk membantu Anda *memahami* materi kuliah dengan cara menguji pemahaman Anda, bukan memberi contekan." },
              { q: "Apakah data saya aman?", a: "Sangat aman. Dokumen yang Anda unggah hanya digunakan untuk memproses sesi belajar Anda dan tidak digunakan untuk melatih model AI publik secara terbuka. Anda dapat menghapus dokumen kapan saja." }
            ].map((faq, i) => (
              <div key={i} className="border border-[#E9E9E7] rounded-2xl overflow-hidden bg-[#FBFBFA] hover:border-[#DFDFDE] transition-colors">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-semibold text-[#191919] text-[15px]">{faq.q}</span>
                  <ChevronDown size={18} className={`text-[#9B9A97] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-[#787774] text-[15px] leading-relaxed border-t border-[#E9E9E7]/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E9E9E7] bg-white pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">
          {/* Logo & Quote */}
          <div className="lg:max-w-xs">
            <Link href="/" className="flex items-center group mb-8">
              <img src="/logo-nalar.png" alt="Nalar" className="w-28 h-28 object-contain -my-8 -ml-2 -mr-6" />
              <span className="font-bold text-xl tracking-tight text-[#191919] mt-3">Nalar</span>
            </Link>
            <p className="text-[#191919] font-serif italic text-lg leading-relaxed mb-4">
              "We shape our tools,<br />
              and thereafter our tools shape us."
            </p>
            <p className="text-[#787774] text-sm">Marshall McLuhan</p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 w-full lg:w-auto">
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Produk</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Fitur Utama</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Apa yang Baru</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Nalar AI Tutor</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Harga</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Minta Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Sumber Daya</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Panduan Belajar</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Pusat Bantuan</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Akademi</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Komunitas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Perusahaan</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Tentang Kami</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Karier</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Keamanan</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#191919] mb-4">Nalar untuk</h4>
              <ul className="space-y-3 text-sm text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Mahasiswa IT</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Fakultas Kedokteran</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Fakultas Hukum</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">BEM & Organisasi</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-[#E9E9E7] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#787774]">
          <div className="flex items-center gap-6">
            <span>© 2026 Nalar Labs, Inc.</span>
            <Link href="/dashboard" className="hover:text-[#191919] font-medium">Pengaturan Cookie</Link>
            <Link href="/dashboard" className="hover:text-[#191919] font-medium">Syarat & Privasi</Link>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E9E9E7] hover:bg-[#FBFBFA] text-[#191919] font-medium transition-colors bg-white">
            <Globe size={14} /> Bahasa Indonesia (ID) <ChevronDown size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
}
