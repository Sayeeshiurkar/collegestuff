

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Student model
const Student = mongoose.model(
  "Student",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    present: {
      type: Boolean,
      default: true,
    },
  })
);

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    console.log("Students fetched:", students.length);
    res.status(200).json(students);
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a student
app.post("/students", async (req, res) => {
  try {
    const name = req.body?.name;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "Please enter a valid student name.",
      });
    }

    const student = await Student.create({
      name: name.trim(),
    });

    console.log("Student added:", student.name);
    res.status(201).json(student);
  } catch (err) {
    console.error("ADD STUDENT ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

// Update attendance
app.patch("/students/:id", async (req, res) => {
  try {
    if (typeof req.body?.present !== "boolean") {
      return res.status(400).json({
        error: "Attendance must be true or false.",
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { present: req.body.present },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        error: "Student not found.",
      });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("UPDATE ATTENDANCE ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

// Connect to MongoDB, then start server
async function startServer() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/attendance"
    );

    console.log("MongoDB Connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

startServer();

