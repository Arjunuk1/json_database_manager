const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dbPath = path.join(__dirname, "..", "database.json");

function encode(value) {
    return Buffer.from(String(value)).toString("base64");
}

function decode(value) {
    try {
        return Buffer.from(String(value), "base64").toString("utf8");
    } catch (error) {
        return value;
    }
}

// GET all data
router.get("/all", (req, res) => {
    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    const decodedData = data.map(item => {
        const decodedItem = {};

        Object.keys(item).forEach(key => {
            const value = item[key];

            if (typeof value === "string") {
                try {
                    decodedItem[key] = Buffer.from(value, "base64").toString("utf8");
                } catch {
                    decodedItem[key] = value;
                }
            } else {
                decodedItem[key] = value;
            }
        });

        return decodedItem;
    });

    res.json(decodedData);
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