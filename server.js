const express = require("express");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

/////////////////////////////////////////////////////////////////////////////////////////////////// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1qaz@WSX",
    database: "game",
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL database.");
});

/////////////////////////////////////////////////////////////////////////////////////////////////// Signup API
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).send("Username or email already exists.");
                }
                return res.status(500).send("Server error.");
            }
            res.status(201).send("User registered successfully.");
        });
    } catch (err) {
        res.status(500).send("Server error.");
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("All fields are required.");
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) return res.status(500).send("Server error.");
        if (results.length === 0) return res.status(400).send("Invalid username or password.");

        const user = results[0];
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).send("Invalid username or password.");
        }

        res.status(200).send("Login successful.");
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
