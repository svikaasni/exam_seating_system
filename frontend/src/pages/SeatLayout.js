import React, { useEffect, useState } from "react";
import { getAllAllocations } from "../services/api";

const COLUMNS = ["A", "B", "C", "D", "E", "F"];
const COLS_PER_ROW = 6;

const HALL_COLORS = [
  { bg: "rgba(99,179,237,0.10)",  border: "rgba(99,179,237,0.25)",  text: "#63b3ed"  },
  { bg: "rgba(104,211,145,0.10)", border: "rgba(104,211,145,0.25)", text: "#68d391"  },
  { bg: "rgba(246,173,85,0.10)",  border: "rgba(246,173,85,0.25)",  text: "#f6ad55"  },
  { bg: "rgba(183,148,244,0.10)", border: "rgba(183,148,244,0.25)", text: "#b794f4"  },
];

// 🎯 Department Colors
const DEPT_COLORS = {
  "CSE":  { bg: "rgba(99,179,237,0.25)",  border: "#63b3ed" },
  "ECE":  { bg: "rgba(104,211,145,0.25)", border: "#68d391" },
  "EEE":  { bg: "rgba(246,173,85,0.25)",  border: "#f6ad55" },
  "MECH": { bg: "rgba(183,148,244,0.25)", border: "#b794f4" },
  "CIVIL":{ bg: "rgba(245,101,101,0.25)", border: "#f56565" },
  "N/A":  { bg: "rgba(160,174,192,0.25)", border: "#a0aec0" }
};

const DEFAULT_DEPT = {
  bg: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.08)"
};

function SeatLayout() {
  const [data, setData]       = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLayout(); }, []);

  const loadLayout = async () => {
    try {
      const res = await getAllAllocations();

      if (!Array.isArray(res) || res.length === 0) {
        setData({});
        setLoading(false);
        return;
      }

      const latestExam = res[res.length - 1].examName;
      const filtered   = res.filter(a => a.examName === latestExam);

      const grouped = {};
      filtered.forEach(a => {
        const hall = a.hall || "Unknown";
        if (!grouped[hall]) grouped[hall] = [];
        grouped[hall].push(a);
      });

      setData(grouped);
    } catch (err) {
      console.error(err);
      alert("Error loading layout ❌");
    }
    setLoading(false);
  };

  if (loading) return (
    <div style={{ color: "#718096", fontSize: 13, padding: "40px 0", textAlign: "center" }}>
      Loading seat layout…
    </div>
  );

  const hallKeys = Object.keys(data);

  return (
    <div>

      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>
          Hall-wise Seat Layout
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>
          Showing latest exam allocation
        </p>
      </div>

      {/* 🎯 LEGEND ADDED HERE */}
      <div style={{
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 20
      }}>
        {Object.entries(DEPT_COLORS).map(([dept, color]) => (
          <div key={dept} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#e2e8f0",
            background: "#0d1525",
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              background: color.bg,
              border: `1px solid ${color.border}`
            }} />
            {dept}
          </div>
        ))}
      </div>

      {hallKeys.length === 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "48px", textAlign: "center", color: "#4a5568", fontSize: 13,
        }}>
          No layout data — run an allocation first
        </div>
      )}

      {hallKeys.map((hall, idx) => {
        const seats = data[hall];
        const color = HALL_COLORS[idx % HALL_COLORS.length];

        const gridMap = {};
        seats.forEach((s, i) => {
          const colIndex  = i % COLS_PER_ROW;
          const rowNum    = Math.floor(i / COLS_PER_ROW) + 1;
          const colLetter = COLUMNS[colIndex];
          gridMap[`${colLetter}${rowNum}`] = s;
        });

        const totalRows = Math.ceil(seats.length / COLS_PER_ROW);

        return (
          <div key={idx} style={{
            marginBottom: 32,
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            overflow: "hidden",
          }}>

            {/* Hall header */}
            <div style={{
              background: "#0d1525", padding: "14px 20px",
              display: "flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <span style={{
                padding: "4px 14px", borderRadius: 7, fontSize: 13, fontWeight: 700,
                background: color.bg, color: color.text, border: `1px solid ${color.border}`,
              }}>
                HALL NUMBER: {hall}
              </span>
              <span style={{ fontSize: 12, color: "#718096" }}>
                {seats.length} students assigned
              </span>
            </div>

            {/* Seat grid */}
            <div style={{ padding: "20px", overflowX: "auto" }}>

              {/* Column headers */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `52px repeat(6, 1fr) 52px`,
                gap: 4, marginBottom: 4,
              }}>
                <div />
                {COLUMNS.map(col => (
                  <div key={col} style={{
                    textAlign: "center", padding: "8px 4px",
                    fontSize: 13, fontWeight: 700,
                    color: color.text,
                    background: color.bg,
                    border: `1px solid ${color.border}`,
                    borderRadius: 6,
                  }}>{col}</div>
                ))}
                <div />
              </div>

              {/* Rows */}
              {Array.from({ length: totalRows }, (_, r) => {
                const rowNum = r + 1;
                return (
                  <div key={rowNum} style={{
                    display: "grid",
                    gridTemplateColumns: `52px repeat(6, 1fr) 52px`,
                    gap: 4, marginBottom: 4,
                  }}>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#718096",
                      background: "#0d1525", borderRadius: 5,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>{rowNum}</div>

                    {COLUMNS.map(col => {
                      const key = `${col}${rowNum}`;
                      const s   = gridMap[key];

                      const deptColor = s
                        ? (DEPT_COLORS[s.department] || DEFAULT_DEPT)
                        : DEFAULT_DEPT;

                      return (
                        <div key={key} style={{
                          minHeight: 75,
                          padding: "7px 5px",
                          borderRadius: 7,
                          textAlign: "center",
                          background: s ? deptColor.bg : "rgba(255,255,255,0.02)",
                          border: `1px solid ${s ? deptColor.border : "rgba(255,255,255,0.06)"}`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                        }}>
                          <div style={{
                            fontWeight: 700,
                            fontSize: 11,
                            color: s ? deptColor.border : "#2d3748",
                          }}>
                            {col}{rowNum}
                          </div>

                          {s && (
                            <>
                              <div style={{
                                color: "#e2e8f0",
                                fontSize: 11,
                                fontWeight: 500,
                              }}>
                                {s.name}
                              </div>
                              <div style={{
                                color: "#718096",
                                fontSize: 10,
                              }}>
                                {s.department}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#718096",
                      background: "#0d1525", borderRadius: 5,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>{rowNum}</div>

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SeatLayout;