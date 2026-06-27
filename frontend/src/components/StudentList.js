import React, { useEffect, useState } from "react";
import { getStudents, sendEmail } from "../services/api";

function StudentList() {
  const [students, setStudents] = useState([]);

  const load = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEmail = async (s) => {
    await sendEmail({
      to: s.email || "test@gmail.com",
      name: s.name,
      hall: "A Block",
      seat: "101",
      time: "10 AM",
    });

    alert("Email Sent!");
  };

  return (
    <div className="card">
      <h3>Students</h3>

      <ul>
        {students.map((s, i) => (
          <li key={i}>
            {s.name} - {s.roll}
            <button onClick={() => handleEmail(s)}>Send Email</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;