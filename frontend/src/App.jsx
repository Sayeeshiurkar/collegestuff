
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/students");
      setStudents(await res.json());
    } catch {
      alert("Cannot connect to backend!");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const addStudent = async () => {
    if (!name.trim()) {
      alert("Enter student name!");
      return;
    }

    await fetch("http://localhost:5000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() })
    });

    setName("");
    loadStudents();
  };

  const toggleAttendance = async (student) => {
    await fetch(`http://localhost:5000/students/${student._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ present: !student.present })
    });

    loadStudents();
  };

  return (
    <div className="container">
      <h1>Student Attendance Manager</h1>
      <p>Manage your students and track daily attendance.</p>

      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter student name"
        />
        <button onClick={addStudent}>Add Student</button>
      </div>

      <h2>Student List ({students.length})</h2>

      {students.length === 0 && <p>No students added yet.</p>}

      {(Array.isArray(students) ? students : []).map((student) => (
        <div className="student" key={student._id}>
          <span>{student.name}</span>

          <span className={`status ${student.present ? "present" : "absent"}`}>
            {student.present ? "Present" : "Absent"}
          </span>

          <button onClick={() => toggleAttendance(student)}>
            Mark {student.present ? "Absent" : "Present"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
