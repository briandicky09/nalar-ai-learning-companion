"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, ChevronDown, Globe, FileText, Target,
  BrainCircuit, Users, ShieldCheck, LineChart,
  BookOpen, Menu, X, CheckCircle2, Search, SlidersHorizontal,
  Star, Network
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
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const rotatingWords = ["lebih paham", "lebih cepat", "lebih dalam", "lebih terarah"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(wordInterval);
  }, [rotatingWords.length]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#191919] font-sans overflow-x-hidden selection:bg-[#191919] selection:text-white">

      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-[#E9E9E7] shadow-xs py-3.5"
            : "bg-white/60 backdrop-blur-sm border-b border-[#E9E9E7]/60 py-4"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between relative">

          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E9E9E7] flex items-center justify-center p-1 shadow-xs group-hover:border-[#191919] transition-colors">
                <img src="/logo-nalar.png" alt="Nalar" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-base tracking-tight text-[#191919]">Nalar</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2" onMouseLeave={() => setActiveDropdown(null)}>
            <div className="relative" onMouseEnter={() => setActiveDropdown('fitur')}>
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'fitur' ? null : 'fitur')} 
                className="flex items-center gap-1 text-sm font-medium text-[#191919] hover:text-[#787774] transition-colors py-2"
              >
                Fitur <ChevronDown size={14} className={`text-[#9B9A97] transition-transform duration-200 ${activeDropdown === 'fitur' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'fitur' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-white border border-[#E9E9E7] rounded-xl shadow-lg p-2"
                  >
                    <Link href="#extraction" onClick={() => setActiveDropdown(null)} className="flex items-start gap-3 p-2.5 hover:bg-[#F7F6F3] rounded-lg transition-colors group/item">
                      <div className="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] shrink-0">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#191919]">Ekstrak PDF</div>
                        <div className="text-xs text-[#787774]">Otomatis ubah PDF jadi materi interaktif</div>
                      </div>
                    </Link>
                    <Link href="#topic-map" onClick={() => setActiveDropdown(null)} className="flex items-start gap-3 p-2.5 hover:bg-[#F7F6F3] rounded-lg transition-colors group/item">
                      <div className="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] shrink-0">
                        <Network size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#191919]">Peta Konsep</div>
                        <div className="text-xs text-[#787774]">Visualisasi hubungan antar topik</div>
                      </div>
                    </Link>
                    <Link href="#exam-mode" onClick={() => setActiveDropdown(null)} className="flex items-start gap-3 p-2.5 hover:bg-[#F7F6F3] rounded-lg transition-colors group/item">
                      <div className="w-9 h-9 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] shrink-0">
                        <BrainCircuit size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#191919]">Ujian Adaptif</div>
                        <div className="text-xs text-[#787774]">Simulasi ujian yang menyesuaikan kemampuan</div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" onMouseEnter={() => setActiveDropdown('panduan')}>
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'panduan' ? null : 'panduan')} 
                className="flex items-center gap-1 text-sm font-medium text-[#191919] hover:text-[#787774] transition-colors py-2"
              >
                Panduan <ChevronDown size={14} className={`text-[#9B9A97] transition-transform duration-200 ${activeDropdown === 'panduan' ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'panduan' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white border border-[#E9E9E7] rounded-xl shadow-lg p-1.5"
                  >
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-2 hover:bg-[#F7F6F3] rounded-lg transition-colors text-xs font-medium text-[#191919]">Panduan Belajar</Link>
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-2 hover:bg-[#F7F6F3] rounded-lg transition-colors text-xs font-medium text-[#191919]">Pusat Bantuan</Link>
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-2 hover:bg-[#F7F6F3] rounded-lg transition-colors text-xs font-medium text-[#191919]">Akademi Nalar</Link>
                    <Link href="/dashboard" onClick={() => setActiveDropdown(null)} className="block p-2 hover:bg-[#F7F6F3] rounded-lg transition-colors text-xs font-medium text-[#191919]">Komunitas</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/dashboard" className="text-sm font-medium text-[#191919] hover:text-[#787774] transition-colors py-2">
              Harga
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-[#191919] hover:text-[#787774] transition-colors py-2">
              Hubungi Kami
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="text-xs font-medium text-[#191919] hover:text-[#787774] transition-colors px-3 py-1.5">
              Masuk
            </Link>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg bg-[#191919] text-white text-xs font-semibold hover:bg-[#2F3437] transition-all shadow-xs active:scale-95"
            >
              Mulai Gratis
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-[#191919]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-2 text-sm font-medium text-[#191919] mt-4">
              <Link href="#extraction" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 hover:bg-[#F7F6F3] rounded-lg transition-colors">Fitur</Link>
              <Link href="#panduan" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 hover:bg-[#F7F6F3] rounded-lg transition-colors">Panduan</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 hover:bg-[#F7F6F3] rounded-lg transition-colors">Harga</Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 hover:bg-[#F7F6F3] rounded-lg transition-colors">Hubungi Kami</Link>

              <div className="h-[1px] bg-[#E9E9E7] my-3 w-full" />

              <div className="flex flex-col gap-3">
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center text-xs font-medium text-[#787774] hover:text-[#191919] transition-colors">Masuk ke Akun</Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex justify-center items-center w-full py-2.5 rounded-lg bg-[#191919] text-white text-xs font-semibold shadow-xs"
                >
                  Mulai Gratis Sekarang
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-36 sm:pt-44 pb-20 sm:pb-24 px-6 max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">

        {/* Minimalist Corner Crosshairs */}
        <div className="hidden md:block absolute top-20 left-4 text-[#DFDFDE] text-xs select-none font-mono tracking-widest">+</div>
        <div className="hidden md:block absolute top-20 right-4 text-[#DFDFDE] text-xs select-none font-mono tracking-widest">+</div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-[76px] font-bold tracking-[-0.035em] text-[#191919] leading-[1.14] mb-6 max-w-4xl text-balance"
        >
          Belajar{" "}
          <span 
            onClick={() => setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)}
            title="Klik untuk beralih fokus belajar"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl bg-[#141413] text-white font-mono text-[0.72em] sm:text-[0.76em] font-medium tracking-tight align-middle shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_4px_16px_rgba(0,0,0,0.12)] border border-white/10 ml-1.5 mr-0.5 sm:ml-2.5 sm:mr-0.5 -translate-y-1 relative overflow-hidden min-w-[150px] sm:min-w-[210px] justify-center cursor-pointer select-none hover:border-white/25 transition-colors"
          >
            <span className="text-white/40 font-light select-none text-[0.9em]">&gt;_</span>
            <div className="relative h-[1.3em] overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentWordIndex}
                  initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block whitespace-nowrap"
                >
                  {rotatingWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="inline-block w-1.5 sm:w-2 h-3.5 sm:h-4 bg-emerald-400/90 animate-[cursorBlink_1.1s_steps(2,start)_infinite] ml-0.5 shrink-0" />
          </span>,
          <br className="hidden sm:block" /> bukan sekadar keras.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-[#787774] text-base sm:text-lg max-w-xl mx-auto mb-9 leading-relaxed font-normal tracking-[-0.01em]"
        >
          Nalar mengekstrak PDF kuliah Anda, mendeteksi kelemahan pemahaman,
          dan membimbing Anda secara personal layaknya dosen privat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-lg bg-[#191919] text-white text-xs sm:text-sm font-semibold hover:bg-[#2F3437] transition-all shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Mulai belajar sekarang <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-lg bg-white border border-[#DFDFDE] hover:border-[#191919] text-[#191919] text-xs sm:text-sm font-semibold hover:bg-[#FBFBFA] transition-all active:scale-[0.98] flex items-center justify-center"
            >
              Lihat Demo
            </Link>
          </div>
          <div className="text-[11px] text-[#9B9A97] tracking-tight font-medium">
            Gratis untuk memulai • Berbasis kurikulum perkuliahan
          </div>
        </motion.div>

        {/* Vertical Guide Connector to Product Preview */}
        <div className="w-[1px] h-10 sm:h-12 bg-gradient-to-b from-[#DFDFDE] to-transparent mt-8 mb-2" />

        {/* Hero Illustration Mockup — Authentic Socratic Workspace Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-5xl relative"
        >
          <div className="relative rounded-xl overflow-hidden border border-[#E9E9E7] shadow-[0_16px_48px_-16px_rgba(0,0,0,0.06)] bg-white">
            {/* Mockup Window Header */}
            <div className="h-10 bg-[#FBFBFA] border-b border-[#E9E9E7] flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DFDFDE]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DFDFDE]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DFDFDE]" />
                </div>
                <div className="ml-3 h-5 w-48 sm:w-64 bg-white rounded border border-[#E9E9E7] flex items-center px-2 text-[10px] text-[#9B9A97]">
                  nalar.test/dashboard
                </div>
              </div>
              <div className="text-[10px] font-semibold text-[#787774] hidden sm:block">
                Nalar Workspace • PBO Modul 1
              </div>
            </div>

            {/* Mockup Content */}
            <div className="p-6 sm:p-8 text-left flex flex-col md:flex-row gap-6 bg-white">
              <div className="flex-1 space-y-4">
                <div className="border-b border-[#E9E9E7] pb-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-[#787774] uppercase tracking-wider mb-1">
                    <BookOpen size={13} /> Algoritma & Pemrograman Berorientasi Objek
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#191919] tracking-tight">
                    Cetak Biru (Class) vs Objek Nyata (Object)
                  </h3>
                </div>

                <p className="text-xs text-[#55534E] leading-relaxed">
                  Dalam paradigma PBO, <strong>Class</strong> berperan sebagai cetak biru (blueprint) yang mendefinisikan atribut dan perilaku. Sedangkan <strong>Object</strong> adalah wujud nyata hasil cetakan yang menempati memori komputasi.
                </p>

                {/* Socratic Conversation Card */}
                <div className="p-4 rounded-lg bg-[#FBFBFA] border border-[#E9E9E7] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#191919]">
                      <BrainCircuit size={15} /> AI Tutor Sokratik
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      Diskusi Aktif
                    </span>
                  </div>
                  <p className="text-xs text-[#191919] leading-relaxed">
                    &ldquo;Coba bayangkan: Jika kita memiliki class <code>Mobil</code> dan object <code>FerrariMerah</code>, menurutmu apa yang terjadi jika atribut <code>kecepatanMaksimal</code> diubah menjadi private?&rdquo;
                  </p>
                  <div className="text-[11px] text-[#787774] flex items-center gap-1.5 pt-1">
                    <span>💡 Menguji pemahaman konsep dasar <strong>Encapsulation</strong></span>
                  </div>
                </div>
              </div>

              {/* Sidebar Diagnostics Mockup */}
              <div className="w-full md:w-72 space-y-3 shrink-0">
                <div className="p-4 rounded-lg bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-[#787774] uppercase tracking-wider">Penguasaan Modul</span>
                    <span className="text-xs font-bold text-[#191919]">68%</span>
                  </div>
                  <div className="text-sm font-bold text-[#191919] mb-2">PBO Dasar</div>
                  <div className="h-1.5 w-full bg-[#E9E9E7] rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-[#191919] rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#787774] mt-1.5">
                    <span>2 Dikuasai</span>
                    <span>2 Perlu Latihan</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#FBFBFA] border border-[#E9E9E7]">
                  <div className="text-xs font-semibold text-[#191919] mb-2 flex items-center justify-between">
                    <span>Kelemahan Terdeteksi</span>
                    <span className="text-[10px] bg-red-50 text-red-700 border border-red-200/60 px-2 py-0.5 rounded-full font-semibold">Prioritas</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 bg-white border border-[#E9E9E7] rounded text-xs text-[#191919] font-medium flex items-center justify-between">
                      <span>Polymorphism</span>
                      <span className="text-red-600 font-semibold text-[11px]">40%</span>
                    </div>
                    <div className="p-2 bg-white border border-[#E9E9E7] rounded text-xs text-[#191919] font-medium flex items-center justify-between">
                      <span>Abstraction</span>
                      <span className="text-amber-600 font-semibold text-[11px]">55%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee Social Proof */}
      <section className="border-y border-[#E9E9E7] bg-[#FBFBFA] py-3.5 overflow-hidden relative z-10 before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-16 before:bg-gradient-to-r before:from-[#FBFBFA] before:to-transparent before:z-10 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-16 after:bg-gradient-to-l after:from-[#FBFBFA] after:to-transparent after:z-10">
        <div className="flex items-center whitespace-nowrap overflow-hidden">
          <div className="animate-marquee gap-14 items-center">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 text-xs font-medium text-[#191919] shrink-0">
                  <Users size={15} className="text-[#787774]" /> <span>10.000+ Mahasiswa aktif</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#191919] shrink-0">
                  <Globe size={15} className="text-[#787774]" /> <span>Digunakan di 50+ Kampus</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#191919] shrink-0">
                  <BookOpen size={15} className="text-[#787774]" /> <span>3 Juta+ Halaman PDF diekstrak</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#191919] shrink-0">
                  <Target size={15} className="text-[#787774]" /> <span>Meningkatkan Retensi hingga 40%</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#191919] shrink-0">
                  <ShieldCheck size={15} className="text-[#787774]" /> <span>Privasi Data Terjamin</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja Nalar */}
      <section id="extraction" className="py-24 px-6 max-w-6xl mx-auto bg-white relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-xs font-bold tracking-widest text-[#787774] uppercase mb-3">
            Cara Kerja Nalar
          </motion.h2>
          <motion.h3 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#191919]">
            Dari PDF ke penguasaan <br className="hidden sm:block" /> materi dalam menit.
          </motion.h3>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Step 1 */}
          <motion.div variants={fadeUp} className="workspace-panel p-6 flex flex-col h-full group hover:border-[#191919] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-6 text-sm font-bold">1</div>

            <div className="mb-6 w-full aspect-[4/3] rounded-lg bg-[#FBFBFA] border border-[#E9E9E7] flex items-center justify-center">
              <div className="p-4 rounded-lg bg-white border border-[#E9E9E7] text-[#191919] shadow-xs flex items-center gap-3">
                <FileText size={24} />
                <div className="text-left">
                  <div className="text-xs font-semibold">Slide_Kuliah.pdf</div>
                  <div className="text-[10px] text-[#787774]">2.4 MB • 42 Halaman</div>
                </div>
              </div>
            </div>

            <h4 className="text-base font-bold text-[#191919] mb-2">Unggah Materi</h4>
            <p className="text-[#787774] leading-relaxed text-xs">
              Tarik dan lepas PDF, slide kuliah, atau modul belajar. AI kami akan membedah teks, gambar, dan tabel secara instan.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div id="topic-map" variants={fadeUp} className="workspace-panel p-6 flex flex-col h-full group hover:border-[#191919] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-6 text-sm font-bold">2</div>

            <div className="mb-6 w-full aspect-[4/3] rounded-lg bg-[#FBFBFA] border border-[#E9E9E7] flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1.5 rounded bg-white border border-[#191919] text-[11px] font-bold text-[#191919] shadow-xs">
                  Class & Object
                </div>
                <div className="w-4 h-[1px] bg-[#191919]" />
                <div className="px-2.5 py-1.5 rounded bg-[#191919] text-white text-[11px] font-bold shadow-xs">
                  Encapsulation
                </div>
              </div>
            </div>

            <h4 className="text-base font-bold text-[#191919] mb-2">Peta Konsep Terbentuk</h4>
            <p className="text-[#787774] leading-relaxed text-xs">
              Nalar secara otomatis membuat pohon pengetahuan, menghubungkan konsep inti yang harus Anda pahami.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div id="exam-mode" variants={fadeUp} className="workspace-panel p-6 flex flex-col h-full group hover:border-[#191919] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] text-[#191919] flex items-center justify-center mb-6 text-sm font-bold">3</div>

            <div className="mb-6 w-full aspect-[4/3] rounded-lg bg-[#FBFBFA] border border-[#E9E9E7] flex items-center justify-center p-4">
              <div className="w-full bg-white border border-[#E9E9E7] rounded-lg p-3 text-left space-y-1.5 shadow-xs">
                <div className="text-[10px] font-bold text-[#787774] uppercase">AI Sokratik</div>
                <div className="text-xs text-[#191919] font-medium">&ldquo;Kenapa overriding berbeda dengan overloading?&rdquo;</div>
              </div>
            </div>

            <h4 className="text-base font-bold text-[#191919] mb-2">Evaluasi Sokratik</h4>
            <p className="text-[#787774] leading-relaxed text-xs">
              Uji pemahaman Anda melalui mode tanya-jawab adaptif yang memaksa Anda berpikir kritis, bukan menghafal.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Large Features */}
      <section id="fitur" className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Large Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="workspace-panel p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-[#191919] mb-2">
                Evaluasi Mandiri
              </h3>
              <p className="text-[#787774] text-xs sm:text-sm leading-relaxed">
                Uji seberapa jauh Anda memahami materi dengan kuis pintar yang mendeteksi setiap titik buta pengetahuan.
              </p>
            </div>

            <div className="bg-[#FBFBFA] rounded-lg border border-[#E9E9E7] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#191919]">
                <div className="flex items-center gap-2">
                  <FileText size={15} /> Kuis Diagnostik
                </div>
                <span className="text-[10px] text-[#787774]">Soal 1 dari 5</span>
              </div>
              <div className="text-xs font-semibold text-[#191919] pt-1">
                Manakah karakteristik utama dari konsep Polymorphism?
              </div>
              <div className="space-y-2 pt-1">
                <div className="p-2 bg-white rounded border border-[#E9E9E7] text-xs text-[#787774] flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border border-[#DFDFDE] flex items-center justify-center text-[10px]">A</span>
                  <span>Menyembunyikan detail implementasi data</span>
                </div>
                <div className="p-2 bg-[#F7F6F3] rounded border border-[#191919] text-xs text-[#191919] font-medium flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#191919] text-white flex items-center justify-center text-[10px] font-bold">B</span>
                  <span>Memiliki banyak bentuk melalui overriding & overloading</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Large Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="workspace-panel p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold tracking-tight text-[#191919] mb-2">
                Dosen privat di sakumu
              </h3>
              <p className="text-[#787774] text-xs sm:text-sm leading-relaxed">
                Bertanya pada AI Tutor layaknya berdiskusi dengan manusia. Nalar menjawab berbasis konteks spesifik PDF kuliah Anda.
              </p>
            </div>

            <div className="bg-[#FBFBFA] rounded-lg border border-[#E9E9E7] p-5 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#E9E9E7] text-[#191919] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">M</div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E9E9E7] text-xs text-[#191919] leading-relaxed">
                  Tolong jelaskan ulang konsep polimorfisme, saya masih bingung bedanya dengan inheritance.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-[#191919] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">N</div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E9E9E7] text-xs text-[#191919] leading-relaxed space-y-1">
                  <p>Bayangkan inheritance adalah mewariskan cetak biru kendaraan.</p>
                  <p className="text-[#787774]">Sedangkan polymorphism adalah kemampuan setiap kendaraan merespons perintah &apos;bergerak&apos; dengan cara uniknya sendiri.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Small Features Grid */}
      <section className="py-20 px-6 border-t border-[#E9E9E7] bg-white relative z-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-lg font-bold text-[#191919] mb-6">Lihat kemampuan magis Nalar</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#extraction" className="workspace-panel p-5 hover:border-[#191919] transition-all group flex flex-col justify-between min-h-[140px]">
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                <Search size={16} />
              </div>
              <h4 className="font-semibold text-[#191919] text-sm flex items-center justify-between">
                <span>Ekstrak PDF otomatis</span>
                <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h4>
            </Link>

            <Link href="#topic-map" className="workspace-panel p-5 hover:border-[#191919] transition-all group flex flex-col justify-between min-h-[140px]">
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                <BrainCircuit size={16} />
              </div>
              <h4 className="font-semibold text-[#191919] text-sm flex items-center justify-between">
                <span>Peta Konsep Cerdas</span>
                <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h4>
            </Link>

            <Link href="/dashboard" className="workspace-panel p-5 hover:border-[#191919] transition-all group flex flex-col justify-between min-h-[140px]">
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                <LineChart size={16} />
              </div>
              <h4 className="font-semibold text-[#191919] text-sm flex items-center justify-between">
                <span>Knowledge Profile</span>
                <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h4>
            </Link>

            <Link href="#exam-mode" className="workspace-panel p-5 hover:border-[#191919] transition-all group flex flex-col justify-between min-h-[140px]">
              <div className="w-8 h-8 rounded-lg bg-[#F7F6F3] border border-[#E9E9E7] flex items-center justify-center text-[#191919] mb-4">
                <SlidersHorizontal size={16} />
              </div>
              <h4 className="font-semibold text-[#191919] text-sm flex items-center justify-between">
                <span>Mode Ujian Adaptif</span>
                <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h4>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats & Testimonials */}
      <section className="py-20 px-6 w-full relative z-10 border-t border-[#E9E9E7] bg-[#FBFBFA]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest text-[#787774] uppercase mb-2">
            Telah Dipercaya oleh Ratusan Ribu Pelajar
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#191919] mb-3">
            Dampak Nyata Nalar bagi Mahasiswa
          </h2>
          <p className="text-[#787774] text-xs sm:text-sm max-w-xl mx-auto mb-12 leading-relaxed">
            Lebih dari 650.000 pelajar dari berbagai kampus di Indonesia telah membuktikan efektivitas platform kami.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="workspace-panel p-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#191919] mb-1">650k+</div>
              <div className="text-xs font-medium text-[#787774]">Pengguna Aktif</div>
            </div>
            <div className="workspace-panel p-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#191919] mb-1">1.5M+</div>
              <div className="text-xs font-medium text-[#787774]">Catatan Dibuat</div>
            </div>
            <div className="workspace-panel p-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#191919] mb-1">4.9/5</div>
              <div className="text-xs font-medium text-[#787774]">Rating Pengguna</div>
            </div>
            <div className="workspace-panel p-5 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#191919] mb-1">1.0k+</div>
              <div className="text-xs font-medium text-[#787774]">Sekolah & Kampus</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto mt-20 relative before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-16 before:bg-gradient-to-r before:from-[#FBFBFA] before:to-transparent before:z-10 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-16 after:bg-gradient-to-l after:from-[#FBFBFA] after:to-transparent after:z-10">
          <h3 className="text-xl font-bold text-[#191919] mb-8 text-center">Apa Kata Mereka?</h3>
          <div className="flex overflow-hidden relative w-full">
            <div className="animate-marquee-slow gap-4 py-2">
              {[...Array(4)].map((_, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {[
                    { name: "Charlie Hernando", text: "Aplikasi yang bener-bener ngebantu, apalagi buat yang mau belajar dengan deadline H-1. Membuat materi panjang menjadi bagian inti yang bisa dipelajarin. Ada Quiz dan AI yang ngebantu buat yang masih belum paham soal materi." },
                    { name: "Mayla Fazza", text: "Semenjak tau aplikasi ini, nilai aku semakin naik dan aku semakin aktif di kelas. Aplikasi ini punya banyak fitur yang sangat berguna buat pelajar, apalagi bisa diakses gratis. Pokoknya aku cinta banget sama aplikasi ini!" },
                    { name: "Sajiwa Baswara", text: "AI-nya beneran ngebantu banget buat aku yang kuliah ini, apalagi ada kuis yang bikin aku makin paham. Next kalau ada rezeki lagi mau langganan yang 6 bulan buat semester 2!" },
                    { name: "Rina Salsabila", text: "Fitur Peta Konsepnya sangat *game-changer*! Aku bisa melihat gambaran besar dari modul kuliah yang rumit jadi super jelas. Nalar beneran inovasi terbaik buat mahasiswa." }
                  ].map((testimonial, i) => (
                    <div key={`${groupIndex}-${i}`} className="w-80 md:w-96 shrink-0 workspace-panel p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#191919] text-white flex items-center justify-center font-bold text-xs">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs text-[#191919]">{testimonial.name}</h4>
                          <div className="flex text-[#191919] mt-0.5 gap-0.5">
                            {[...Array(5)].map((_, idx) => <Star key={idx} size={11} fill="currentColor" />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-[#55534E] leading-relaxed text-xs">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 border-t border-[#E9E9E7] bg-white relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191919] mb-2">Kenapa Nalar?</h2>
            <p className="text-[#787774] text-xs sm:text-sm">Bandingin sama platform lain.</p>
          </div>

          <div className="workspace-panel overflow-hidden">
            <div className="grid grid-cols-12 items-center p-4 border-b border-[#E9E9E7] bg-[#FBFBFA]">
              <div className="col-span-6 md:col-span-8 text-xs font-semibold text-[#787774]">Fitur Platform</div>
              <div className="col-span-3 md:col-span-2 text-center text-xs font-semibold text-[#787774]">Situs lain</div>
              <div className="col-span-3 md:col-span-2 text-center text-xs font-bold text-[#191919]">Nalar</div>
            </div>

            {[
              "Ubah video YouTube & PDF jadi materi interaktif",
              "Bahasa Indonesia native dengan konteks lokal",
              "Peta Konsep + Kuis + Chat AI dalam satu tempat",
              "Harga pelajar yang sangat terjangkau",
              "Aplikasi mobile tersinkronisasi",
              "Prediksi kelemahan & rekomendasi belajar otomatis"
            ].map((feature, i) => (
              <div key={i} className={`grid grid-cols-12 items-center p-4 ${i !== 5 ? 'border-b border-[#E9E9E7]' : ''} hover:bg-[#FBFBFA] transition-colors`}>
                <div className="col-span-6 md:col-span-8 text-xs font-medium text-[#191919]">{feature}</div>
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#F1F1EF] flex items-center justify-center text-[#9B9A97]">
                    <X size={13} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#191919] flex items-center justify-center text-white shadow-xs">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="panduan" className="py-20 px-6 border-t border-[#E9E9E7] bg-[#FBFBFA] relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191919] mb-2">Pertanyaan Umum</h2>
            <p className="text-[#787774] text-xs sm:text-sm">Hal-hal yang sering ditanyakan pengguna baru</p>
          </div>

          <div className="space-y-3">
            {[
              { q: "Apa itu Nalar?", a: "Nalar adalah asisten belajar berbasis AI yang dapat mengubah materi kuliah (PDF, PPT, Word) menjadi ringkasan, peta konsep, dan kuis interaktif secara otomatis." },
              { q: "Format file apa saja yang didukung?", a: "Saat ini Nalar mendukung format PDF, DOCX (Word), PPTX (PowerPoint), dan TXT. Kami juga segera menghadirkan fitur konversi tautan YouTube." },
              { q: "Apakah gratis?", a: "Ya, Nalar memiliki paket gratis (Basic) yang bisa langsung Anda gunakan. Untuk fitur lanjutan seperti kuota dokumen lebih banyak dan prioritas AI, kami menyediakan paket Premium dengan harga terjangkau." },
              { q: "Berapa lama proses ekstrak catatan?", a: "Tergantung ukuran file Anda. Biasanya hanya membutuhkan waktu kurang dari 30 detik untuk menghasilkan Peta Konsep dan bahan Kuis." },
              { q: "Apakah ini termasuk kecurangan akademik?", a: "Tidak. Nalar tidak membuatkan esai atau tugas untuk Anda. Nalar dirancang menggunakan metode Sokratik untuk membantu Anda *memahami* materi kuliah dengan cara menguji pemahaman Anda, bukan memberi contekan." },
              { q: "Apakah data saya aman?", a: "Sangat aman. Dokumen yang Anda unggah hanya digunakan untuk memproses sesi belajar Anda dan tidak digunakan untuk melatih model AI publik secara terbuka. Anda dapat menghapus dokumen kapan saja." }
            ].map((faq, i) => (
              <div key={i} className="workspace-panel overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
                >
                  <span className="font-semibold text-[#191919] text-xs sm:text-sm">{faq.q}</span>
                  <ChevronDown size={16} className={`text-[#9B9A97] transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 sm:p-5 pt-0 text-[#787774] text-xs sm:text-sm leading-relaxed border-t border-[#E9E9E7]">
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
      <footer className="border-t border-[#E9E9E7] bg-white pt-14 pb-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-10 mb-12">
          {/* Logo & Quote */}
          <div className="lg:max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E9E9E7] flex items-center justify-center p-1 shadow-xs group-hover:border-[#191919] transition-colors">
                <img src="/logo-nalar.png" alt="Nalar" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-base tracking-tight text-[#191919]">Nalar</span>
            </Link>
            <p className="text-[#191919] italic text-sm leading-relaxed mb-2 font-serif">
              &ldquo;We shape our tools,<br />
              and thereafter our tools shape us.&rdquo;
            </p>
            <p className="text-[#787774] text-xs">Marshall McLuhan</p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-xs text-[#191919] uppercase tracking-wider mb-3">Produk</h4>
              <ul className="space-y-2 text-xs text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Fitur Utama</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Apa yang Baru</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Nalar AI Tutor</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Harga</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Minta Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#191919] uppercase tracking-wider mb-3">Sumber Daya</h4>
              <ul className="space-y-2 text-xs text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Panduan Belajar</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Pusat Bantuan</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Akademi</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Komunitas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#191919] uppercase tracking-wider mb-3">Perusahaan</h4>
              <ul className="space-y-2 text-xs text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Tentang Kami</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Karier</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Keamanan</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#191919] uppercase tracking-wider mb-3">Nalar untuk</h4>
              <ul className="space-y-2 text-xs text-[#787774]">
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Mahasiswa IT</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Fakultas Kedokteran</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">Fakultas Hukum</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#191919] transition-colors">BEM & Organisasi</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="max-w-6xl mx-auto pt-6 border-t border-[#E9E9E7] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#787774]">
          <div className="flex items-center gap-4">
            <span>© 2026 Nalar Labs, Inc.</span>
            <Link href="/dashboard" className="hover:text-[#191919]">Pengaturan Cookie</Link>
            <Link href="/dashboard" className="hover:text-[#191919]">Syarat & Privasi</Link>
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#E9E9E7] hover:bg-[#FBFBFA] text-[#191919] text-xs font-medium transition-colors bg-white">
            <Globe size={13} /> Bahasa Indonesia (ID) <ChevronDown size={13} />
          </button>
        </div>
      </footer>
    </div>
  );
}
