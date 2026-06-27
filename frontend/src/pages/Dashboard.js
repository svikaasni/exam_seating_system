import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";
import { FaUsers, FaCheckCircle, FaEnvelope, FaFilePdf } from "react-icons/fa";

/* ── tiny stat card ── */
function StatCard({ className, icon, label, value }) {
  return (
    <div className={`dashboard-card ${className}`}>
      <div>
        <h4>{label}</h4>
        <h2>{value}</h2>
      </div>
      <div style={{ opacity: 0.45, fontSize: 32 }}>{icon}</div>
    </div>
  );
}

/* ── quick action button ── */
function QuickBtn({ href, label, color }) {
  const colors = {
    blue:   { bg: "rgba(99,179,237,0.12)",  border: "rgba(99,179,237,0.25)",  text: "#63b3ed"  },
    green:  { bg: "rgba(104,211,145,0.12)", border: "rgba(104,211,145,0.25)", text: "#68d391"  },
    yellow: { bg: "rgba(246,173,85,0.12)",  border: "rgba(246,173,85,0.25)",  text: "#f6ad55"  },
    purple: { bg: "rgba(183,148,244,0.12)", border: "rgba(183,148,244,0.25)", text: "#b794f4"  },
  }[color] || {};

  return (
    <button
      onClick={() => window.location.href = href}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        padding: "10px 18px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
        margin: "4px 6px 4px 0",
      }}
    >
      {label}
    </button>
  );
}

function Dashboard() {
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    students: 0,
    allocations: 0,
    emails: 0,
    pdf: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔥 LOAD DATA
  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats({
        students: data?.students || 0,
        allocations: data?.allocations || 0,
        emails: data?.emails || 0,
        pdf: data?.pdf || 0,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div style={{ maxWidth: 1100 }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 22
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>
            Dashboard
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#718096" }}>
            Welcome back — logged in as{" "}
            <strong style={{ color: "#63b3ed" }}>{role}</strong>
          </p>
        </div>

        <button onClick={loadStats} style={{ fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div style={{ color: "#718096", fontSize: 13, padding: "20px 0" }}>
          Loading dashboard…
        </div>
      )}

      {/* ── ADMIN ── */}
      {!loading && role === "ADMIN" && (
        <>
          <div className="dashboard-grid">
            <StatCard className="card-blue"   icon={<FaUsers />}       label="Total Students"   value={stats.students} />
            <StatCard className="card-green"  icon={<FaCheckCircle />} label="Allocations Done" value={stats.allocations} />
            <StatCard className="card-yellow" icon={<FaEnvelope />}    label="Emails Sent"      value={stats.emails} />
            <StatCard className="card-red"    icon={<FaFilePdf />}     label="PDFs Generated"   value={stats.pdf} />
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>
              Quick Actions
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <QuickBtn href="/students"   label="Manage Students" color="blue" />
              <QuickBtn href="/allocation" label="Run Allocation"  color="green" />
              <QuickBtn href="/pdf"        label="Download PDF"    color="yellow" />
              <QuickBtn href="/layout"     label="Seat Layout"     color="purple" />
            </div>
          </div>
        </>
      )}

      {/* ── STAFF ── */}
      {!loading && role === "STAFF" && (
        <>
          <div className="dashboard-grid">
            <StatCard className="card-green" icon={<FaCheckCircle />} label="Allocations" value={stats.allocations} />
            <StatCard className="card-red"   icon={<FaFilePdf />}     label="PDFs Generated" value={stats.pdf} />
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>
              Quick Actions
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {/* ✅ Allowed */}
              <QuickBtn href="/allocation" label="View Allocation" color="green" />
              <QuickBtn href="/layout"     label="Seat Layout"     color="blue" />
              <QuickBtn href="/pdf"        label="Download PDF"    color="yellow" />
            </div>
          </div>
        </>
      )}

      {/* ── STUDENT ── */}
      {!loading && role === "STUDENT" && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card card-yellow" style={{ maxWidth: 260 }}>
              <div>
                <h4>My Allocation</h4>
                <h2>🪑</h2>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#e2e8f0" }}>
              Quick Actions
            </h3>
            <QuickBtn href="/my-allocation" label="View My Seat" color="purple" />
          </div>
        </>
      )}

    </div>
  );
}

export default Dashboard;