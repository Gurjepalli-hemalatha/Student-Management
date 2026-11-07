
// CRUD operations of students table of school database

const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());

// Read HTML files from public folder
app.use(express.static("public"));

// Connection establishment with school database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hema@2005",
    database: "school"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// TO GET DETAILS OF ALL STUDENTS
app.get("/students", (req, res) => {
    db.query("SELECT * FROM student", (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// TO GET THE DETAILS OF ONE STUDENT
app.get("/students/:sno", (req, res) => {
    db.query(
        "SELECT * FROM student WHERE student_id=?",
        [req.params.sno],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            res.json(result);
        }
    );
});

// TO INSERT STUDENT DATA
app.post("/students", (req, res) => {
    const { sno, name, total, age, phone } = req.body;

    db.query(
        "INSERT INTO student(student_id, student_name, total, age, phone) VALUES(?,?,?,?,?)",
        [sno, name, total, age, phone],
        (err) => {
            if (err) return res.status(500).send(err.message);
            res.send("Student Inserted");
        }
    );
});

// TO UPDATE STUDENT DETAILS
app.put("/students/:id", (req, res) => {
    const id = req.params.id;
    const { student_name, total, age, phone } = req.body;

    const sql = `
        UPDATE student
        SET student_name=?, total=?, age=?, phone=?
        WHERE student_id=?
    `;

    db.query(
        sql,
        [student_name, total, age, phone, id],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            if (result.affectedRows === 0)
                return res.status(404).send("Student not found");

            res.send("Student updated successfully!");
        }
    );
});

// TO DELETE STUDENT DETAILS
app.delete("/students/:sno", (req, res) => {
    db.query(
        "DELETE FROM student WHERE student_id=?",
        [req.params.sno],
        (err, result) => {
            if (err) return res.status(500).send(err.message);

            if (result.affectedRows === 0)
                return res.status(404).send("Student NOT found to delete");

            res.send("Student Deleted");
        }
    );
});

// SERVER LISTENING ON PORT 3000
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
