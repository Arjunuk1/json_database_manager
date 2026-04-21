const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dbPath = path.join(__dirname, "..", "database.json");

function encode(value) {
    return Buffer.from(String(value)).toString("base64");
}

function decode(value) {
    return Buffer.from(String(value), "base64").toString("utf8");
}

// GET all data
router.get("/all", (req, res) => {
    const decodedData = data.map(item => ({
    ...item,
    name: decode(item.name),
    email: decode(item.email),
    createdAt: item.createdAt ? decode(item.createdAt) : ""
}));

res.json(decodedData);
res.json(data);
});

// CREATE new data
router.post("/create", (req, res) => {
    const { name, email } = req.body;

    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const newUser = {
    id: Date.now(),
    name: encode(name),
    email: encode(email),
    createdAt: encode(new Date().toLocaleString())
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