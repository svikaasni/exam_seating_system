import React, { useState } from "react";
import * as XLSX from "xlsx";
import { uploadStudents } from "../services/api";

function UploadStudents() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  // ================= UPLOAD — logic unchanged =================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet    = workbook.Sheets[workbook.SheetNames[0]];
      const rows     = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const students = rows.map((row) => {
        const s = {};
        Object.keys(row).forEach(key => { s[key.toLowerCase().trim()] = row[key]; });

        if (!s.email || !s.registerno) return null;

        return {
          registerNo:  String(s.registerno).trim(),
          name:        String(s.name || "").trim(),
          email:       String(s.email).toLowerCase().trim(),
          year:        Number(s.year || 1),
          department:  { departmentName: String(s.department || "").trim() },
        };
      }).filter(Boolean);

      const uniqueStudents = Array.from(
        new Map(students.map(s => [s.email || s.registerNo, s])).values()
      );

      await uploadStudents(uniqueStudents);
      alert(`✅ Uploaded ${uniqueStudents.length} students`);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌\n" + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600 }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>Upload Students</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>Import student list from an Excel file (.xlsx / .xls)</p>
      </div>

      {/* Upload card */}
      <div style={{
        background: "#111827", border: "2px dashed rgba(99,179,237,0.25)",
        borderRadius: 14, padding: "40px 30px", textAlign: "center",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
        <p style={{ color: "#a0aec0", fontSize: 13, margin: "0 0 20px" }}>
          Columns required: <strong style={{ color: "#e2e8f0" }}>registerNo, name, email, year, department</strong>
        </p>

        <label style={{
          display: "inline-block", padding: "10px 24px",
          background: "linear-gradient(135deg,#63b3ed,#4299e1)",
          borderRadius: 9, color: "#0a0f1e", fontWeight: 700, fontSize: 13,
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
        }}>
          {loading ? "Uploading…" : "Choose Excel File"}
          <input
            type="file" accept=".xlsx,.xls"
            onChange={handleFileUpload}
            disabled={loading}
            style={{ display: "none" }}
          />
        </label>

        {fileName && !loading && (
          <p style={{ marginTop: 14, fontSize: 12, color: "#68d391" }}>✓ {fileName}</p>
        )}
        {loading && (
          <p style={{ marginTop: 14, fontSize: 12, color: "#f6ad55" }}>Processing…</p>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: 20, background: "#111827",
        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "16px 18px",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#718096", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Instructions</div>
        {[
          "First row must be the header row",
          "email and registerNo are mandatory fields",
          "Duplicate emails are automatically removed",
          "department column should match existing department names",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#a0aec0" }}>
            <span style={{ color: "#63b3ed", flexShrink: 0 }}>→</span> {t}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UploadStudents;