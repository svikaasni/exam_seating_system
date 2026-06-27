import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import {
  FaTachometerAlt,
  FaUsers,
  FaChair,
  FaFilePdf,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaThLarge
} from "react-icons/fa";

function Layout({ children }) {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const sideW = collapsed ? 68 : 220;

  return (
    <div style={{ display: "flex", background: "#0a0f1e", minHeight: "100vh" }}>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: sideW,
        height: "100vh",
        background: "#111827",
        position: "fixed",
        left: 0, top: 0,
        padding: collapsed ? "20px 10px" : "20px 14px",
        transition: "width 0.25s, padding 0.25s",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        overflow: "hidden",
      }}>

        {/* LOGO ROW */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, overflow: "hidden" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#63b3ed,#b794f4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
          }}>🎓</div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap" }}>ExamSeat Pro</div>
              <div style={{ fontSize: 10, color: "#4a5568", whiteSpace: "nowrap" }}>RIT System</div>
            </div>
          )}
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            color: "#718096", marginBottom: 16, cursor: "pointer", borderRadius: 7,
            padding: "7px", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "0.15s", alignSelf: "flex-start", width: collapsed ? 36 : "100%",
          }}
        >
          <FaBars size={13} />
          {!collapsed && <span style={{ marginLeft: 8, fontSize: 12 }}>Collapse</span>}
        </button>

        {/* NAV */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <MenuLink to="/" active={isActive("/")} collapsed={collapsed} icon={<FaTachometerAlt size={14} />} text="Dashboard" />

          {role === "ADMIN" && (
            <>
              <MenuLink to="/students"      active={isActive("/students")}      collapsed={collapsed} icon={<FaUsers size={14} />}          text="Students" />
              <MenuLink to="/allocation"    active={isActive("/allocation")}    collapsed={collapsed} icon={<FaChair size={14} />}          text="Allocation" />
              <MenuLink to="/pdf"           active={isActive("/pdf")}           collapsed={collapsed} icon={<FaFilePdf size={14} />}        text="PDF" />
              <MenuLink to="/notifications" active={isActive("/notifications")} collapsed={collapsed} icon={<FaBell size={14} />}           text="Notifications" />
              <MenuLink to="/layout"        active={isActive("/layout")}        collapsed={collapsed} icon={<FaThLarge size={14} />}        text="Seat Layout" />
            </>
          )}

          {role === "STAFF" && (
            <>
              <MenuLink to="/allocation"    active={isActive("/allocation")}    collapsed={collapsed} icon={<FaChair size={14} />}    text="Allocation" />
              <MenuLink to="/pdf"           active={isActive("/pdf")}           collapsed={collapsed} icon={<FaFilePdf size={14} />}  text="PDF" />
              <MenuLink to="/layout"        active={isActive("/layout")}        collapsed={collapsed} icon={<FaThLarge size={14} />}  text="Seat Layout" />
            </>
          )}

          {role === "STUDENT" && (
            <MenuLink to="/my-allocation" active={isActive("/my-allocation")} collapsed={collapsed} icon={<FaChair size={14} />} text="My Seat" />
          )}
        </nav>

        {/* USER + LOGOUT */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "rgba(99,179,237,0.12)", border: "1px solid rgba(99,179,237,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#63b3ed", flexShrink: 0,
              }}>
                {(localStorage.getItem("username") || "U").charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {localStorage.getItem("username") || "User"}
                </div>
                <div style={{ fontSize: 10, color: "#4a5568" }}>{role}</div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            style={{
              width: "100%", padding: collapsed ? "9px" : "9px 12px",
              background: "rgba(252,129,129,0.1)", border: "1px solid rgba(252,129,129,0.2)",
              color: "#fc8181", borderRadius: 8, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
              gap: 8, fontSize: 12, fontWeight: 500, transition: "0.15s",
            }}
          >
            <FaSignOutAlt size={13} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{
        marginLeft: sideW,
        width: `calc(100% - ${sideW}px)`,
        transition: "margin-left 0.25s, width 0.25s",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          position: "sticky", top: 0,
          left: sideW, right: 0, zIndex: 99,
        }}>
          <Topbar />
        </div>

        <div style={{
          padding: "24px",
          background: "#0a0f1e",
          minHeight: "calc(100vh - 60px)",
          flex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── MENU LINK ── */
function MenuLink({ to, active, collapsed, icon, text }) {
  return (
    <Link
      to={to}
      title={collapsed ? text : ""}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 10,
        color: active ? "#63b3ed" : "#718096",
        padding: collapsed ? "9px" : "9px 12px",
        marginBottom: 2,
        textDecoration: "none",
        borderRadius: 8,
        background: active ? "rgba(99,179,237,0.12)" : "transparent",
        border: active ? "1px solid rgba(99,179,237,0.2)" : "1px solid transparent",
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        transition: "0.15s",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      <span style={{ flexShrink: 0 }}>{icon}</span>
      {!collapsed && text}
    </Link>
  );
}

export default Layout;