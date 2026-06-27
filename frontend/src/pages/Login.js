import React, { useState } from "react";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", password: "", role: "STUDENT" });

  // ✅ LOGIN — logic unchanged
  const handleLogin = async () => {
    try {
      const token = btoa(loginData.username + ":" + loginData.password);
      const res = await fetch("http://localhost:8080/auth/me", {
        method: "GET",
        headers: { Authorization: "Basic " + token },
      });
      if (!res.ok) { alert("Invalid username or password ❌"); return; }
      const user = await res.json();
      localStorage.setItem("auth", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("username", user.username);
      alert("Login successful ✅");
      onLogin();
    } catch (err) {
      console.error(err);
      alert("Login failed ❌");
    }
  };

  // ✅ REGISTER — logic unchanged
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await res.text();
      alert(data);
      if (data.toLowerCase().includes("success")) setIsRegister(false);
    } catch (err) {
      alert("Registration failed ❌");
    }
  };

  return (
    <div style={styles.page}>

      {/* ── Animated background ── */}
      <div style={styles.bgWrap}>
        <div style={styles.bgGrad} />
        {/* floating orbs */}
        <div style={{ ...styles.orb, width: 420, height: 420, top: "-80px", left: "-100px", background: "radial-gradient(circle, rgba(99,179,237,0.18) 0%, transparent 70%)", animationDuration: "8s" }} />
        <div style={{ ...styles.orb, width: 320, height: 320, bottom: "-60px", right: "-60px", background: "radial-gradient(circle, rgba(183,148,244,0.16) 0%, transparent 70%)", animationDuration: "11s", animationDelay: "2s" }} />
        <div style={{ ...styles.orb, width: 240, height: 240, top: "40%", right: "18%", background: "radial-gradient(circle, rgba(104,211,145,0.12) 0%, transparent 70%)", animationDuration: "14s", animationDelay: "4s" }} />
        {/* grid lines */}
        <div style={styles.grid} />
        {/* floating particles */}
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            ...styles.particle,
            width:  4 + (i % 3) * 3,
            height: 4 + (i % 3) * 3,
            left:   `${5 + (i * 37) % 90}%`,
            top:    `${10 + (i * 53) % 80}%`,
            animationDuration: `${4 + (i % 5) * 2}s`,
            animationDelay:    `${(i * 0.4) % 4}s`,
            opacity: 0.15 + (i % 4) * 0.08,
            background: ["#63b3ed","#b794f4","#68d391","#f6ad55"][i % 4],
          }} />
        ))}
      </div>

      {/* ── Login card ── */}
      <div style={styles.card}>

        {/* top accent line */}
        <div style={styles.cardAccent} />

        {/* Logo */}
        <div style={styles.iconWrap}>
          <span style={{ fontSize: 26 }}>🎓</span>
        </div>

        <h2 style={styles.title}>
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p style={styles.subtitle}>
          {isRegister
            ? "Register to access the system"
            : "Exam Seating System — RIT Chennai"}
        </p>

        {/* ── LOGIN FORM ── */}
        {!isRegister ? (
          <>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "rgba(99,179,237,0.6)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "rgba(99,179,237,0.6)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <button style={styles.mainBtn} onClick={handleLogin}
              onMouseEnter={e => e.target.style.opacity = "0.88"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              Sign In
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>or continue with</span>
              <span style={styles.dividerLine} />
            </div>

            <button
              style={styles.googleBtn}
              onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
              onMouseEnter={e => e.target.style.borderColor = "rgba(255,255,255,0.22)"}
              onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="google" style={{ width: 18 }} />
              Sign in with Google
            </button>
          </>
        ) : (
          <>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "rgba(99,179,237,0.6)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Choose a password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "rgba(99,179,237,0.6)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Role</label>
              <select
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                style={{ ...styles.input, cursor: "pointer" }}
              >
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button style={styles.mainBtn} onClick={handleRegister}
              onMouseEnter={e => e.target.style.opacity = "0.88"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >
              Create Account
            </button>
          </>
        )}

        <p style={styles.toggle}>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            style={styles.toggleLink}
            onMouseEnter={e => e.target.style.textDecoration = "underline"}
            onMouseLeave={e => e.target.style.textDecoration = "none"}
          >
            {isRegister ? "Sign In" : "Register"}
          </span>
        </p>

      </div>

      {/* ── CSS keyframes injected ── */}
      <style>{`
        @keyframes floatOrb {
          0%   { transform: scale(1)   translateY(0px); }
          50%  { transform: scale(1.1) translateY(-20px); }
          100% { transform: scale(1)   translateY(0px); }
        }
        @keyframes twinkle {
          0%,100% { transform: scale(1);   opacity: 0.2; }
          50%      { transform: scale(1.8); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#060b18",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  },

  /* background layers */
  bgWrap: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  bgGrad: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, #060b18 0%, #0d1a2e 40%, #0a1020 70%, #060b18 100%)",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    animation: "floatOrb linear infinite",
  },
  particle: {
    position: "absolute",
    borderRadius: "50%",
    animation: "twinkle ease-in-out infinite",
  },

  /* card */
  card: {
    position: "relative",
    zIndex: 10,
    width: 400,
    padding: "36px 36px 28px",
    borderRadius: 20,
    background: "rgba(13,21,37,0.85)",
    border: "1px solid rgba(99,179,237,0.15)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.6), 0 0 80px rgba(99,179,237,0.06)",
  },
  cardAccent: {
    position: "absolute",
    top: 0, left: "10%", right: "10%",
    height: 2,
    borderRadius: "0 0 4px 4px",
    background: "linear-gradient(90deg, transparent, #63b3ed, #b794f4, transparent)",
  },

  /* icon */
  iconWrap: {
    width: 56, height: 56,
    borderRadius: 16,
    background: "rgba(99,179,237,0.1)",
    border: "1px solid rgba(99,179,237,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 0 20px rgba(99,179,237,0.15)",
  },

  title: {
    margin: "0 0 6px",
    fontSize: 22,
    fontWeight: 700,
    color: "#e2e8f0",
    textAlign: "center",
  },
  subtitle: {
    margin: "0 0 24px",
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
  },

  /* fields */
  fieldGroup: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "#718096",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 9,
    color: "#e2e8f0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
    fontFamily: "inherit",
  },

  /* buttons */
  mainBtn: {
    width: "100%",
    padding: "12px",
    marginTop: 6,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #63b3ed, #4299e1)",
    color: "#060b18",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    transition: "opacity 0.15s",
    fontFamily: "inherit",
    letterSpacing: 0.3,
  },

  /* divider */
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "18px 0",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.08)",
    display: "block",
  },
  dividerText: {
    fontSize: 12,
    color: "#4a5568",
    whiteSpace: "nowrap",
  },

  googleBtn: {
    width: "100%",
    padding: "11px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "#e2e8f0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: 500,
    transition: "border-color 0.15s",
    margin: 0,
    fontFamily: "inherit",
  },

  toggle: {
    marginTop: 20,
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
  },
  toggleLink: {
    color: "#63b3ed",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Login;