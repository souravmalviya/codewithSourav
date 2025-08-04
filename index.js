// index.js

const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static("public")); // Serve static files from 'public' folder

const JWT_SECRET = "sourav123";
const users = [];

// Middleware to log every request
function logger(req, res, next) {
    console.log(`${req.method} request to ${req.url}`);
    next();
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const token = req.headers.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.username) {
            req.username = decoded.username;
            next();
        } else {
            res.status(403).json({ message: "Invalid token" });
        }
    } catch (err) {
        res.status(403).json({ message: "Token verification failed" });
    }
}

// Route: Sign Up
app.post('/signup', logger, (req, res) => {
    const { username, password } = req.body;
    users.push({ username, password });
    res.json({ message: "You are signed up successfully" });
});

// Route: Sign In
app.post('/signin', logger, (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username }, JWT_SECRET);
        res.send({ token });
    } else {
        res.status(403).send({ message: "Invalid username or password" });
    }
});

// Route: Protected /me
app.get('/me', authenticateToken, logger, (req, res) => {
    const user = users.find(u => u.username === req.username);
    if (user) {
        res.send({ message: user.username });
    } else {
        res.status(401).send({ message: "Unauthorized" });
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
