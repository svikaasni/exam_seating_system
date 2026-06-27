import React, { useState, useEffect } from "react";
import { getAllAllocations, downloadPDF } from "../services/api";

function PDF() {
  const [examName, setExamName] = useState("");
  const [exams, setExams]       = useState([]);
  const [loading, setLoading]   = useState(false);

  // ✅ LOAD EXAMS — logic unchanged
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const allocations = await getAllAllocations();
        if (!Array.isArray(allocations)) { setExams([]); return; }

        const uniqueExams = [
          ...new Set(
            allocations.map((a) => a.examName || a.exam?.examName).filter((n) => n && n.trim() !== "")
          ),
        ];
        setExams(uniqueExams);
      } catch (err) {
        console.error(err);
        if (err.message.includes("401")) alert("Unauthorized ❌ Please login");
        else alert("Error fetching exams ❌");
      }
    };
    fetchExams();
  }, []);

  // ✅ DOWNLOAD — logic unchanged
  const handleDownload = async () => {
    if (!examName) { alert("Please select an exam ❗"); return; }
    setLoading(true);
    try {
      await downloadPDF(examName);
      alert(`PDF for "${examName}" downloaded ✅`);
    } catch (err) {
      console.error(err);
      if (err.message.includes("404")) alert("No allocations found ❌");
      else alert("Download failed ❌");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500 }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>Download PDF</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>Export seating arrangement as a PDF</p>
      </div>

      {/* Card */}
      <div style={{
        background: "#111827", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: "24px",
      }}>
        <div style={{ fontSize: 36, textAlign: "center", marginBottom: 18 }}>📄</div>

        <label style={{ fontSize: 12, color: "#718096", fontWeight: 500, display: "block", marginBottom: 7 }}>
          Select Exam
        </label>
        <select
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px",
            background: "#0d1525", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: examName ? "#e2e8f0" : "#4a5568",
            fontSize: 13, outline: "none", cursor: "pointer", marginBottom: 18,
          }}
        >
          <option value="">— Choose an exam —</option>
          {exams.map((exam, idx) => (
            <option key={idx} value={exam}>{exam}</option>
          ))}
        </select>

        <button
          onClick={handleDownload}
          disabled={loading || !examName}
          style={{
            width: "100%", padding: "12px",
            background: loading || !examName
              ? "rgba(255,255,255,0.05)"
              : "linear-gradient(135deg,#68d391,#38a169)",
            border: "none",
            color: loading || !examName ? "#4a5568" : "#0a0f1e",
            borderRadius: 9, fontWeight: 700, fontSize: 14,
            cursor: loading || !examName ? "not-allowed" : "pointer",
            transition: "0.15s",
          }}
        >
          {loading ? "Downloading…" : "⬇ Download PDF"}
        </button>

        {exams.length === 0 && (
          <p style={{ marginTop: 14, fontSize: 12, color: "#4a5568", textAlign: "center" }}>
            No exams available — run an allocation first
          </p>
        )}
      </div>
    </div>
  );
}

export default PDF;