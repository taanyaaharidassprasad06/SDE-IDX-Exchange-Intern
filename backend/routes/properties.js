const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (request, response) => {
    
    /*
        Pagination parameters:
        - limit: number of results to return per page (default 20)
        - offset: number of rows to skip (default 0)
     */
    const limit = request.query.limit !== undefined ? Number(request.query.limit) : 20; 
    const offset = request.query.offset !== undefined ? Number(request.query.offset) : 0; 
    
    const city = request.query.city || "";
    const zipcode = request.query.zipcode || "";

    const minPrice = request.query.minPrice !== undefined ? Number(request.query.minPrice) : undefined; 
    const maxPrice = request.query.maxPrice !== undefined ? Number(request.query.maxPrice) : undefined;

    const beds = request.query.beds !== undefined ? Number(request.query.beds) : undefined;
    const baths = request.query.baths !== undefined ? Number(request.query.baths) : undefined;
    
    // input validation
    if(!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return response.status(400).json({ status: "error", message: "limit must be a whole number between 1 and 100"});
    }
    if(!Number.isInteger(offset) || offset < 0) {
        return response.status(400).json({ status: "error", message: "offset must be a whole number greater than or equal to 0"});
    }
    
    if(minPrice !== undefined && (!Number.isInteger(minPrice) || minPrice < 0)) {
        return response.status(400).json({ status: "error", message: "minPrice must be a whole number greater than or equal to 0"});
    }
    if(maxPrice !== undefined && (!Number.isInteger(maxPrice) || maxPrice < 0)) {
        return response.status(400).json({ status: "error", message: "maxPrice must be a whole number greater than or equal to 0"});
    }
    if(minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        return response.status(400).json({ status: "error", message: "minPrice must be less than maxPrice"});
    }
    
    if(beds !== undefined && (!Number.isInteger(beds) || beds < 0)) {
        return response.status(400).json({ status: "error", message: "beds must be a whole number greater than or equal to 0"});
    }
    if(baths !== undefined && (!Number.isInteger(baths) || baths < 0)) {
        return response.status(400).json({ status: "error", message: "baths must be a whole number greater than or equal to 0"});
    }

    /*
        dynamic SQL query construction
        - conditions[] stores SQL WHERE conditions
        - values[] stores parameter values for "?" placeholders
        - together they create a parameterized query 
     */
    const conditions = [];
    const values = [];

    if(city) {
        conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
        values.push(city);
    }
    if(zipcode) {
        conditions.push("L_Zip = ?");
        values.push(zipcode);
    }
    if(minPrice !== undefined) {
        conditions.push("L_SystemPrice >= ?");
        values.push(minPrice);
    }
    if(maxPrice !== undefined) {
        conditions.push("L_SystemPrice <= ?");
        values.push(maxPrice);
    }
    if(beds !== undefined) {
        conditions.push("L_Keyword2 >= ?");
        values.push(beds);
    }
    if(baths !== undefined) {
        conditions.push("LM_Dec_3 >= ?");
        values.push(baths);
    }
    
    // combines all WHERE conditions into a single SQL query string
    const whereClause = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

    /*
        pool.query() returns: [rows, fields]
        - rows: array of result rows (actual data from db)
        - fields: metadata about columns
     */
    try {
        // get paginated rows matching filters
        const allRowsSQL = "SELECT * FROM rets_property" + whereClause + " LIMIT ? OFFSET ?";
        const allRowsValues = [...values, limit, offset];
        const [rows] = await pool.query(allRowsSQL, allRowsValues);

        // get total number of rows matching filters (without LIMIT/OFFSET)
        const totalCountSQL = "SELECT COUNT(*) AS total FROM rets_property" + whereClause;
        const [countResult] = await pool.query(totalCountSQL, values);
        const total = countResult[0].total;

        response.json({
            total,
            limit,
            offset,
            results: rows
        });
    } catch(error) {
        console.log(error.message);
        response.status(500).json({ status: "error", message: "failed to fetch properties" });
    }
});

module.exports = router;