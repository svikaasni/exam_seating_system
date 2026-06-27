import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Allocation from "./pages/Allocation";
import Students from "./pages/Students";
import PDF from "./pages/Pdf";
import MyAllocation from "./pages/MyAllocation";
import Login from "./pages/Login";
import SeatLayout from "./pages/SeatLayout";
import Notification from "./pages/Notification"; // ✅ ADD

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("auth"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    const userRole = localStorage.getItem("role");

    if (!auth) {
      setIsLoggedIn(false);
      setRole(null);
    } else {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={() => {
      setIsLoggedIn(true);
      setRole(localStorage.getItem("role"));
    }} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>

          {/* COMMON */}
          <Route path="/" element={<Dashboard />} />

          {/* ADMIN */}
          {role === "ADMIN" && (
            <>
              <Route path="/students" element={<Students />} />
              <Route path="/allocation" element={<Allocation />} />
              <Route path="/pdf" element={<PDF />} />
              <Route path="/layout" element={<SeatLayout />} />
              <Route path="/notifications" element={<Notification />} /> {/* ✅ FIX */}
            </>
          )}

          {/* STAFF */}
          {role === "STAFF" && (
            <>
              {/* ✅ ALLOW VIEW ONLY */}
              <Route path="/allocation" element={<Allocation />} />
              <Route path="/pdf" element={<PDF />} />
              <Route path="/layout" element={<SeatLayout />} />
              {/* ❌ NO NOTIFICATIONS */}
            </>
          )}

          {/* STUDENT */}
          {role === "STUDENT" && (
            <>
              <Route path="/my-allocation" element={<MyAllocation />} />
            </>
          )}

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;