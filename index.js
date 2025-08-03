
const express = require('express');
const jwt = require('jsonwebtoken'); // For generating and verifying JWT tokens
const app = express();

// Use middleware to parse incoming JSON requests
app.use(express.json());
//app.use(express.static("public")); // <-- serve static files

// JWT secret key (should ideally be stored securely in environment variables)
const JWT_SECRET = "sourav123";

// In-memory storage for users (in real applications, use a database)
const users = [];

/**
 * Route Handler: Sign Up
 * Allows a user to sign up with a username and password.
 */
function signupHandler(req, res) {
    //const { username, password } = req.body;

    const username= req.body.username;
    const password= req.body.password;
    // Check if user already exists (commented out in original)
    // if (users.find(u => u.username === username)) {
    //     return res.json({ message: "User already signed up" });
    // }

    users.push( //pussing datat in memory variable 
        { 
            username,
             password }
    );

    res.json({
        message: "You are signed up successfully"
    });
}

/**
 * Route Handler: Sign In
 * Authenticates a user and returns a JWT token if credentials are valid.
 */
function signinHandler(req, res) {
   // const { username, password } = req.body;
    const username= req.body.username;
    const password= req.body.password;

    const user = users.find(user => user.username === username && user.password === password);
    console.log(user); // For debugging

    if (user) {
        const token = jwt.sign({ username }, JWT_SECRET);

        res.send({ token });
        console.log(users); // For debugging
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        });
    }
}

/**
 * Middleware: Authentication
 * Verifies the JWT token and allows access to protected routes.
 */
function logger(req, res, next){
    console.log(`${req.method} request came` )
    next();

}
function authenticateToken(req, res, next) {
    const token = req.headers.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.username) {
            req.username = decoded.username;
            next(); // Proceed to the next middleware/route

        } else {
            res.status(403).json({ message: "Invalid token" });
        }
    } catch (err) {
        res.status(403).json({ message: "Token verification failed" });
    }
}

/**
 * Protected Route: /me
 * Returns the username of the logged-in user based on the token provided.
 */


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


app.get('/me', authenticateToken,logger, (req, res) => {
    const user = users.find(user => user.username === req.username);

    if (user) {
        res.send({
            message: user.username
        });
    } else {
        res.status(401).send({
            message: "Unauthorized"
        });
    }
});

// Define signup and signin endpoints
app.post('/signup',logger, signupHandler);
app.post('/signin',logger, signinHandler);

// Start the Express server
app.listen(3000, () => {
    console.log("Your app is running on port 3000");
});
