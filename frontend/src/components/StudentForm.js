import React, { useState } from "react";
import { addStudent } from "../services/api";

function StudentForm({ refresh }) {
  const [form, setForm] = useState({
    name: "",
    registerNo: "",
    email: "",
    year: "",
    subject: "",
    departmentId: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const { name, registerNo, email, year, subject, departmentId } = form;

    if (!name || !registerNo || !email || !year || !subject || !departmentId) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addStudent({
        name,
        registerNo,
        email,
        year: parseInt(year),
        subject,
        department: {
          departmentId: parseInt(departmentId)
        }
      });

      alert("Student Added ✅");

      setForm({
        name: "",
        registerNo: "",
        email: "",
        year: "",
        subject: "",
        departmentId: ""
      });

      refresh();

    } catch (err) {
      console.error(err);
      alert("Error adding student ❌");
    }
  };

  return (
    <div className="card">
      <h3>Add Student</h3>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />

      <input name="registerNo" placeholder="Register No" value={form.registerNo} onChange={handleChange} />

      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

      <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} />

      <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />

      <select name="departmentId" value={form.departmentId} onChange={handleChange}>
        <option value="">Select Department</option>
        <option value="1">CSE</option>
        <option value="2">ECE</option>
        <option value="3">MECH</option>
        <option value="4">EEE</option>
      </select>

      <button onClick={handleSubmit}>Add Student</button>
    </div>
  );
}

export default StudentForm;