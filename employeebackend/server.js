const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use(
    cors({
        origin: "https://fsd2-wheat.vercel.app", // Your frontend URL
        methods: "GET,POST,PUT,DELETE",         // Allowed HTTP methods
        allowedHeaders: "Content-Type",         // Allowed headers
    })
);



const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12752979",
    password: "V2Fysg3uy1",
    database: "sql12752979",
});

db.connect((err) => {
    if (err) {
       console.log("Error connecting to db");
    }
    else {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT} and connected to db`);
        });        
    }
});

app.post("https://fsd2.onrender.com/api/employees", (req, res) => {
    const {
        name,
        employeeId,
        email,
        phoneNumber,
        department,
        dateOfJoining,
        role,
    } = req.body;

    if (
        !name ||
        !employeeId ||
        !email ||
        !phoneNumber ||
        !department ||
        !dateOfJoining ||
        !role
    ) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = `
    INSERT INTO employees (name, employeeId, email, phoneNumber, department, dateOfJoining, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    db.query(
        query,
        [name, employeeId, email, phoneNumber, department, dateOfJoining, role],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ message: "Employee ID or Email already exists" });
                }
                console.error(err);
                return res.status(500).json({ message: "Database error" });
            }
            res.status(200).json({ message: "Employee added successfully", data: result });
        }
    );
});
