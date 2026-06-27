import React from "react";
import { FaUserCircle } from "react-icons/fa";

function Topbar() {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const roleColor = {
    ADMIN:   { bg: "rgba(99,179,237,0.12)",  color: "#63b3ed",  border: "rgba(99,179,237,0.25)"  },
    STAFF:   { bg: "rgba(104,211,145,0.12)", color: "#68d391",  border: "rgba(104,211,145,0.25)" },
    STUDENT: { bg: "rgba(183,148,244,0.12)", color: "#b794f4",  border: "rgba(183,148,244,0.25)" },
  }[role] || { bg: "rgba(255,255,255,0.08)", color: "#a0aec0", border: "rgba(255,255,255,0.15)" };

  return (
    <div style={{
      width: "100%",
      height: 60,
      background: "#111827",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 22px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    }}>

      {/* LEFT — page context */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
          background: "rgba(104,211,145,0.12)", color: "#68d391",
          border: "1px solid rgba(104,211,145,0.25)",
        }}>● System Active</span>
        <span style={{ fontSize: 12, color: "#4a5568" }}>
          {new Date().toLocaleDateString("en-IN", { dateStyle: "medium" })}
        </span>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Role badge */}
        <span style={{
          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: roleColor.bg, color: roleColor.color,
          border: `1px solid ${roleColor.border}`,
        }}>{role}</span>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(99,179,237,0.12)", border: "1px solid rgba(99,179,237,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#63b3ed",
          }}>
            {(username || "U").charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{username}</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(252,129,129,0.1)",
            border: "1px solid rgba(252,129,129,0.25)",
            color: "#fc8181",
            padding: "7px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Topbar;