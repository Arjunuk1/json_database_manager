const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersPath = path.join(__dirname, "..", "users.json");

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

    const existingUser = users.find(user => user.username === username);

    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    res.json({ message: "Registration successful" });
});
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

    const user = users.find(
        user => user.username === username && user.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful" });
});

module.exports = router;