"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, FileUp, Loader2, AlertCircle } from "lucide-react";
import { getMaterials, processMaterial, uploadMaterial } from "@/lib/api/client";
import { Material } from "@/lib/api/types";

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchList = () => {
    getMaterials()
      .then((data) => setMaterials(data))
      .catch((err) => console.warn("Failed to fetch materials:", err));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setUploadError("Hanya file PDF yang diperbolehkan.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      const newMat = await uploadMaterial(file, cleanTitle);

      // Add to list immediately with pending status
      setMaterials((prev) => [newMat, ...prev]);

      // Automatically trigger processing
      try {
        await processMaterial(newMat.id);
        fetchList();
      } catch (procErr) {
        console.warn("Processing triggered with note:", procErr);
        fetchList();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUploadError(err.message || "Gagal mengunggah file.");
      } else {
        setUploadError("Gagal mengunggah file.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Baru saja";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 800 }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#191919", letterSpacing: "-0.02em", margin: 0 }}>
          Materi Kuliah
        </h1>
        <p style={{ fontSize: 14, color: "#787774", margin: 0 }}>
          Unggah dokumen PDF untuk diekstrak topik dan strukturnya oleh Nalar.
        </p>
      </div>

      {uploadError && (
        <div style={{ padding: "12px 16px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FCA5A5", display: "flex", alignItems: "center", gap: 8, color: "#991B1B", fontSize: 13 }}>
          <AlertCircle size={16} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? "#191919" : "#DFDFDE"}`,
          borderRadius: 16,
          padding: "64px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: isDragging ? "#F7F6F3" : "#FFFFFF",
          transition: "all 0.2s ease",
          cursor: "pointer"
        }}
      >
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "#F7F6F3",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
        }}>
          {isUploading ? (
            <Loader2 size={28} color="#191919" className="animate-spin" />
          ) : (
            <UploadCloud size={28} color="#191919" />
          )}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#191919", margin: "0 0 8px" }}>
          {isUploading ? "Mengunggah & Memproses PDF..." : "Tarik & Lepas File PDF di sini"}
        </h3>
        <p style={{ fontSize: 13, color: "#787774", margin: "0 0 24px", maxWidth: 320 }}>
          Sistem akan otomatis membaca isi materi dan memetakan struktur pembelajaran Anda.
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          disabled={isUploading}
          style={{
            padding: "10px 20px", borderRadius: 8, background: "#191919", color: "#FFF",
            border: "none", fontSize: 13, fontWeight: 500, cursor: isUploading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 8
          }}
        >
          <FileUp size={16} /> {isUploading ? "Memproses..." : "Pilih File (Maks. 50MB)"}
        </button>
      </div>

      {/* File List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#191919", margin: 0 }}>Riwayat Unggahan</h2>

        {materials.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#787774", fontSize: 13, background: "#FBFBFA", borderRadius: 12, border: "1px solid #E9E9E7" }}>
            Belum ada materi yang diunggah. Unggah file PDF pertama kamu di atas.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {materials.map((file, idx) => (
              <motion.div
                key={file.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px", borderRadius: 12, border: "1px solid #E9E9E7", background: "#FBFBFA"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#F7F6F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={20} color="#191919" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#191919", marginBottom: 4 }}>
                      {file.title || file.original_filename}
                    </div>
                    <div style={{ fontSize: 12, color: "#787774" }}>
                      {formatSize(file.file_size)} • {file.created_at ? formatDate(file.created_at) : "Baru saja"} • {file.topics_count || (file.topics?.length ?? 0)} Topik
                    </div>
                  </div>
                </div>
                <div>
                  {file.processing_status === "completed" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#059669", fontSize: 12, fontWeight: 500, background: "#D1FAE5", padding: "4px 10px", borderRadius: 999 }}>
                      <CheckCircle2 size={14} /> Selesai
                    </div>
                  ) : file.processing_status === "failed" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#DC2626", fontSize: 12, fontWeight: 500, background: "#FEE2E2", padding: "4px 10px", borderRadius: 999 }}>
                      <AlertCircle size={14} /> Gagal
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#D97706", fontSize: 12, fontWeight: 500, background: "#FEF3C7", padding: "4px 10px", borderRadius: 999 }}>
                      <Loader2 size={14} className="animate-spin" /> Memproses
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
