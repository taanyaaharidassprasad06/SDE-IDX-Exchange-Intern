const request = require("supertest");
const app = require("./index");

describe("GET /api/properties - week 3 debug challenge", () => {
    test("BUG: minPrice + bed filters should work together", async () => {
        const res = await request(app).get("/api/properties").query({minPrice: 300000, beds: 3});
        
        expect(res.statusCode).toBe(200);

        expect(res.body.results.length).toBeGreaterThan(0);

        res.body.results.forEach(property => {
            expect(Number(property.L_SystemPrice)).toBeGreaterThanOrEqual(300000);
            expect(Number(property.L_Keyword2)).toBeGreaterThanOrEqual(3);
        });
    });
});
