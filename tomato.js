//const express = require('express');
//const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
//app.use(express.static("public")); // <-- serve static files

const JWT_SECRET = "sourav123";
const users = [];

function signupHandler(req, res) {
    const { username, password } = req.body;
    users.push({ username, password });
    res.json({ message: "You are signed up successfully" });
}

function signinHandler(req, res) {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username }, JWT_SECRET);
        res.send({ token });
    } else {
        res.status(403).send({ message: "Invalid username or password" });
    }
}

function logger(req, res, next){
    console.log(`${req.method} request came`);
    next();
}

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

app.post('/signup', logger, signupHandler);
app.post('/signin', logger, signinHandler);

app.get('/me', authenticateToken, logger, (req, res) => {
    const user = users.find(user => user.username === req.username);
    if (user) {
        res.send({ message: user.username });
    } else {
        res.status(401).send({ message: "Unauthorized" });
    }
});

app.listen(3000, () => {
    console.log("Your app is running on port 3000");
});