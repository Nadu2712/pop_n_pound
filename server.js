const express = require("express");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const axios = require("axios");

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

/////////////////////////////////////////////////////////////////////////////////////////////////// Fetch question data from external API
app.get("/game/question", async (req, res) => {
    try {
        const response = await axios.get("http://marcconrad.com/uob/banana/api.php?out=json");
        const questionData = response.data;
        res.status(200).json(questionData);
    } catch (error) {
        console.error("Error fetching question data:", error);
        res.status(500).send("Failed to fetch question data.");
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////// Endpoint to save score
app.post('/save-score', (req, res) => {
    const { username, score } = req.body;
  
    if (!username || score == null) {
      return res.status(400).json({ message: 'Username and score are required' });
    }
  
    const query = 'INSERT INTO game_scores (username, score) VALUES (?, ?)';
    db.query(query, [username, score], (err, result) => {
      if (err) {
        console.error('Error saving score:', err);
        return res.status(500).json({ message: 'Error saving score' });
      }
      res.status(200).json({ message: 'Score saved successfully' });
    });
  });

/////////////////////////////////////////////////////////////////////////////////////////////////// Leaderboard

  app.get('/leaderboard', (req, res) => {
    const query = 'SELECT username, score FROM game_scores ORDER BY score DESC LIMIT 10';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching leaderboard:', err);
        return res.status(500).json({ message: 'Error fetching leaderboard' });
      }
      res.status(200).json(results);
    });
  });

/////////////////////////////////////////////////////////////////////////////////////////////////// Start Server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
