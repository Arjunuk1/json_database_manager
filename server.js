const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Allows backend to read JSON sent from frontend
app.use(express.json());

// Serves files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Import routes
const dataRoutes = require("./routes/dataRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api", dataRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});