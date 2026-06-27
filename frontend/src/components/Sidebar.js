import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {

  const role = localStorage.getItem("role");

  return (
    <div className="sidebar">
      <h2>Exam System</h2>

      <Link to="/">Dashboard</Link>

      {/* ADMIN ONLY */}
      {role === "ADMIN" && (
        <>
          <Link to="/students">Students</Link>
          <Link to="/allocation">Allocation</Link>
          <Link to="/pdf">PDF</Link>
        </>
      )}

      {/* STAFF */}
      {role === "STAFF" && (
        <>
          <Link to="/allocation">View Allocation</Link>
          <Link to="/pdf">Download PDF</Link>
        </>
      )}

      {/* STUDENT */}
      {role === "STUDENT" && (
        <>
          <Link to="/my-allocation">My Seat</Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;