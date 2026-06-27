import React, { useState, useEffect } from "react";
import { runAllocation, getAllAllocations } from "../services/api";

/* shared input style */
const inp = {
  padding: "9px 12px",
  background: "#0d1525",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
  flex: 1,
  minWidth: 160,
};

function Allocation() {

  const role = localStorage.getItem("role"); // ✅ ROLE CHECK

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [hallFilter, setHallFilter] = useState("");

  const [examName, setExamName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [examDateTime, setExamDateTime] = useState("");

  const [running, setRunning] = useState(false);
  const [sending, setSending] = useState(false);

  // ================= LOAD =================
  const loadAllocations = async () => {
    try {
      const result = await getAllAllocations();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAllocations();
  }, []);

  // ================= RUN =================
  const handleAllocation = async () => {
    if (!examName || !courseCode || !examDateTime) {
      alert("Fill all fields ❌");
      return;
    }

    if (running) return;

    setRunning(true);

    try {
      await runAllocation({ examName, courseCode, examDateTime });
      alert("Allocation Done ✅");

      setExamName("");
      setCourseCode("");
      setExamDateTime("");

      loadAllocations();
    } catch (err) {
      alert("Failed ❌");
    }

    setRunning(false);
  };

  // ================= WHATSAPP =================
  const sendWhatsApp = async () => {
    if (sending) return;

    setSending(true);

    try {
      const res = await fetch("http://localhost:8080/allocation/send-whatsapp", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa("akshara:akash123"),
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      alert("WhatsApp Sent ✅");
    } catch (err) {
      console.error(err);
      alert("WhatsApp Failed ❌");
    }

    setSending(false);
  };

  // ================= FILTER =================
  const filteredData = data.filter((s) => {
    const name = s?.name || "";
    const email = s?.email || "";
    const hall = s?.hall || "";

    return (
      (name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())) &&
      (hallFilter === "" || hall === hallFilter)
    );
  });

  const halls = [...new Set(data.map((s) => s?.hall).filter(Boolean))];

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* HEADER */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>
          Seat Allocation
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>
          {role === "ADMIN"
            ? "Run allocation and manage seating"
            : "View allocation (Read Only)"}
        </p>
      </div>

      {/* CONFIG PANEL */}
      <div
        style={{
          background: "#111827",
          border: "1px solid rgba(99,179,237,0.15)",
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#e2e8f0",
            marginBottom: 14,
          }}
        >
          Configure Exam
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
          <input
            style={inp}
            placeholder="Exam Name"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            disabled={role !== "ADMIN"} // ✅ disable for staff
          />
          <input
            style={inp}
            placeholder="Course Code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            disabled={role !== "ADMIN"}
          />
          <input
            type="datetime-local"
            style={inp}
            value={examDateTime}
            onChange={(e) => setExamDateTime(e.target.value)}
            disabled={role !== "ADMIN"}
          />
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 8 }}>

          {/* ADMIN ONLY */}
          {role === "ADMIN" && (
            <>
              <button
                onClick={handleAllocation}
                disabled={running}
                style={{
                  background: running
                    ? "rgba(255,255,255,0.05)"
                    : "linear-gradient(135deg,#63b3ed,#4299e1)",
                  border: "none",
                  color: running ? "#718096" : "#0a0f1e",
                  padding: "9px 18px",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: running ? "not-allowed" : "pointer",
                }}
              >
                {running ? "Running…" : "⚡ Run Allocation"}
              </button>

              <button
                onClick={sendWhatsApp}
                disabled={sending}
                style={{
                  background: "rgba(104,211,145,0.12)",
                  border: "1px solid rgba(104,211,145,0.25)",
                  color: "#68d391",
                  padding: "9px 16px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: sending ? "not-allowed" : "pointer",
                }}
              >
                {sending ? "Sending…" : "📲 Send WhatsApp"}
              </button>
            </>
          )}

          {/* STAFF MODE */}
          {role === "STAFF" && (
            <span style={{ color: "#718096", fontSize: 13 }}>
              🔒 View Only Mode
            </span>
          )}
        </div>
      </div>

      {/* FILTER */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <input
          style={{ ...inp, flex: "unset", width: 260 }}
          placeholder="Search name / email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={{ ...inp, flex: "unset", width: 180, cursor: "pointer" }}
          value={hallFilter}
          onChange={(e) => setHallFilter(e.target.value)}
        >
          <option value="">All Halls</option>
          {halls.map((h, i) => (
            <option key={i}>{h}</option>
          ))}
        </select>

        <span style={{ fontSize: 12, color: "#718096", alignSelf: "center" }}>
          {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#111827",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Name", "Email", "Department", "Hall", "Seat", "Exam", "Date"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      background: "#0d1525",
                      color: "#718096",
                      fontSize: 11,
                      fontWeight: 500,
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#4a5568" }}>
                  No allocation data
                </td>
              </tr>
            ) : (
              filteredData.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: "11px 14px", color: "#e2e8f0" }}>{s.name}</td>
                  <td style={{ padding: "11px 14px", color: "#718096" }}>{s.email}</td>
                  <td style={{ padding: "11px 14px", color: "#a0aec0" }}>{s.department}</td>
                  <td style={{ padding: "11px 14px" }}>{s.hall}</td>
                  <td style={{ padding: "11px 14px", color: "#68d391" }}>{s.seat}</td>
                  <td style={{ padding: "11px 14px" }}>{s.examName}</td>
                  <td style={{ padding: "11px 14px" }}>{s.examTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Allocation;