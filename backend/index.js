require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const propertiesRouter = require("./routes/properties"); // imports route

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/properties", propertiesRouter);

// health check to confirm server and database are working
app.get("/api/health", async (request, response) => {
    try {
        await pool.query("SELECT 1");
        response.json({ status: "ok", database: "connected" })
    } catch(error) {
        console.log(error);
        response.status(500).json({ status: "error", database: "disconnected", message: error.message }) // send internal server error
    }
});

if(process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}

module.exports = app;
