require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", async(request, response) => {
    try {
        await pool.query("SELECT 1");
        response.json({ status: "ok", database: "connected" })
    } catch(error) {
        console.log(error);
        response.status(500).json({ status: "error", database: "disconnected" }) // send internal server error
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});