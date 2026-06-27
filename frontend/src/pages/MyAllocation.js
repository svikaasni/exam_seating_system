import React, { useEffect, useState } from "react";
import { getAuthHeader } from "../services/api";

function MyAllocation() {
  const [data, setData] = useState([]);

  const loadMyAllocation = async () => {
    try {
      const res = await fetch("http://localhost:8080/allocation/my", {
        headers: getAuthHeader()
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Failed to load your allocation ❌");
    }
  };

  useEffect(() => {
    loadMyAllocation();
  }, []);

  return (
    <div style={{ maxWidth: 800 }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>
          My Seat Allocation
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>
          Your assigned seats for upcoming exams
        </p>
      </div>

      {data.length === 0 ? (
        <div style={{
          background: "#111827",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "48px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🪑</div>
          <div style={{ color: "#718096", fontSize: 13 }}>
            No seat allocation found yet
          </div>
        </div>
      ) : (
        data.map((s, i) => (
          <div key={i} style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "18px 22px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}>

            {/* Seat */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "rgba(99,179,237,0.12)",
              border: "1px solid rgba(99,179,237,0.25)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span>🪑</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#63b3ed" }}>
                {s.seat}
              </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#e2e8f0" }}>{s.name}</div>
              <div style={{ fontSize: 12, color: "#718096" }}>{s.email}</div>
            </div>

            {/* Details */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#4a5568" }}>HALL</div>
              <div style={{ color: "#63b3ed" }}>{s.hall}</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#4a5568" }}>TIME</div>
              <div style={{ color: "#f6ad55" }}>{s.examTime}</div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default MyAllocation;