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
    const record = req.body;

    const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    data.push(record);

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({
        message: "Record added successfully"
    });
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

    const updatedRecord = req.body;

    let data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    data = data.map(item => {
        if (item.id === id) {
            return updatedRecord;
        }

        return item;
    });

    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

    res.json({
        message: "Record updated"
    });
});

module.exports = router;