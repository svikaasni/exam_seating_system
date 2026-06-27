import React, { useEffect, useState } from "react";

function Notification() {
  const [data, setData] = useState([]);

  // ================= LOAD — logic unchanged =================
  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:8080/notifications", {
        headers: { "Authorization": "Basic " + btoa("akshara:akash123") },
      });

      if (!res.ok) { console.error("Unauthorized or error"); setData([]); return; }

      const text   = await res.text();
      const result = text ? JSON.parse(text) : [];
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 1000 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>WhatsApp Notifications</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>Auto-refreshes every 5 seconds</p>
        </div>
        <span style={{
          padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500,
          background: "rgba(104,211,145,0.12)", color: "#68d391",
          border: "1px solid rgba(104,211,145,0.25)",
        }}>● Live</span>
      </div>

      {/* Table */}
      <div style={{ background: "#111827", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["Email","Phone","Message","Status","Time"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: "left",
                  background: "#0d1525", color: "#718096",
                  fontSize: 11, fontWeight: 500, letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#4a5568", fontSize: 13 }}>
                No notifications yet
              </td></tr>
            ) : (
              data.map((n, i) => (
                <tr key={i}>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#63b3ed", fontSize: 12 }}>{n.studentEmail}</td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "monospace", fontSize: 12, color: "#a0aec0" }}>{n.phone}</td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#e2e8f0", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.message}</td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {n.sent ? (
                      <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(104,211,145,0.12)", color: "#68d391", border: "1px solid rgba(104,211,145,0.25)" }}>Sent</span>
                    ) : (
                      <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(252,129,129,0.12)", color: "#fc8181", border: "1px solid rgba(252,129,129,0.25)" }}>Failed</span>
                    )}
                  </td>
                  <td style={{ padding: "11px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#718096", fontSize: 12 }}>{n.sentTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notification;