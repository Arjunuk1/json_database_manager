const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dbPath = path.join(__dirname, "..", "database.json");

// GET all data
router.get("/all", (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    res.json(data);
});

// CREATE new data
router.post("/create", (req, res) => {
    const { name, email } = req.body;

    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const newUser = {
        id: Date.now(),
        name,
        email
    };
    data.push(newUser);

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({ message: "Data added", user: newUser });
});

// DELETE data
router.delete("/delete/:id", (req, res) => {
    const id = Number(req.params.id);

    let data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    data = data.filter(item => item.id !== id);

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({ message: "Data deleted" });
});

router.put("/edit/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    let data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    data = data.map(item => {
        if (item.id === id) {
            return {
                ...item,
                name,
                email
            };
        }
        return item;
    });

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({ message: "Data updated" });
});

module.exports = router;