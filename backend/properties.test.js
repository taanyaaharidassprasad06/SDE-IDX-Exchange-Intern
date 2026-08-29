const request = require("supertest");

// mock the database so tests do not use MySQL
jest.mock("./db", () => ({
    query: jest.fn()
}));

const pool = require("./db");
const app = require("./server");

// reset mock data before each test
beforeEach(() => {
    jest.clearAllMocks();
});

describe("GET /api/properties", () => {
    describe("successful requests", () => {
        // test route successfully returns properties
        test("returns properties successfully", async () => {
            // create mock properties to use instead of data from real database
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    L_City: "Los Angeles",
                    L_SystemPrice: 2000000,
                    L_Keyword2: 5,
                    LM_Dec_3: 3
                },
                {
                    L_ListingID: "1516171819",
                    L_City: "Orlando",
                    L_SystemPrice: 600000,
                    L_Keyword2: 3,
                    LM_Dec_3: 2
                }
            ];

            // tell mock database what to return for each query
            pool.query
                .mockResolvedValueOnce([mockProperties]) // return mock properties for 1st query
                .mockResolvedValueOnce([[{ total: 2 }]]); // return total number of properties for 2nd query

            // send GET request to properties route
            const res = await request(app).get("/api/properties");

            // check request was successful
            expect(res.statusCode).toBe(200);

            // check response contains expected data
            expect(res.body).toEqual({
                total: 2,
                limit: 20,
                offset: 0,
                results: mockProperties
            });

            // check database was queried twice
            expect(pool.query).toHaveBeenCalledTimes(2);
        });

        test("uses limit and offset for pagination", async () => {
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    L_City: "Los Angeles"
                },
                {
                    L_ListingID: "1516171819",
                    L_City: "Orlando"
                }
            ];

            // return the mock properties and total count
            pool.query
                .mockResolvedValueOnce([mockProperties])
                .mockResolvedValueOnce([[{ total: 50 }]]);

            // request 2 properties starting at row 10
            const res = await request(app)
                .get("/api/properties")
                .query({ limit: 2, offset: 10 });

            
            expect(res.statusCode).toBe(200);

            // check route passed the limit and offset to the 1st database query 
            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("LIMIT ? OFFSET ?"), [2, 10] );
        });
    });

    describe("filters", () => {
        test("filters by city", async () => {
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    L_City: "Los Angeles"
                },
                {
                    L_ListingID: "1516171819",
                    L_City: "Orlando"
                }
            ];

            pool.query
                .mockResolvedValueOnce([[mockProperties[0]]])
                .mockResolvedValueOnce([[{ total: 1 }]]);

            const res = await request(app)
                .get("/api/properties")
                .query({ city: "Los Angeles" });

            expect(res.statusCode).toBe(200);
            expect(res.body.results).toEqual([mockProperties[0]]);

            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("L_City"), ["Los Angeles", 20, 0]);
        });

        test("filters by zipcode", async () => {
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    L_Zip: "90001"
                },
                {
                    L_ListingID: "1516171819",
                    L_Zip: "32801"
                }
            ];

            pool.query
                .mockResolvedValueOnce([[mockProperties[0]]])
                .mockResolvedValueOnce([[{ total: 1 }]]);

            const res = await request(app)
                .get("/api/properties")
                .query({ zipcode: "90001" });

            expect(res.statusCode).toBe(200);
            expect(res.body.results).toEqual([mockProperties[0]]);

            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("L_Zip = ?"), ["90001", 20, 0]);
        });

        test("filters by minimum price", async () => {
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    L_SystemPrice: 500000
                },
                {
                    L_ListingID: "1516171819",
                    L_SystemPrice: 300000
                }
            ];

            pool.query
                .mockResolvedValueOnce([[mockProperties[0]]])
                .mockResolvedValueOnce([[{ total: 1 }]]);

            const res = await request(app)
                .get("/api/properties")
                .query({ minPrice: 400000 });

            expect(res.statusCode).toBe(200);
            expect(res.body.results).toEqual([mockProperties[0]]);

            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("L_SystemPrice >= ?"), [400000, 20, 0]);
        });

        test("filters by maximum price", async () => {
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    L_SystemPrice: 500000
                },
                {
                    L_ListingID: "1516171819",
                    L_SystemPrice: 300000
                }
            ];

            pool.query
                .mockResolvedValueOnce([mockProperties])
                .mockResolvedValueOnce([[{ total: 2 }]]);

            const res = await request(app)
                .get("/api/properties")
                .query({ maxPrice: 600000 });

            expect(res.statusCode).toBe(200);
            expect(res.body.results).toEqual(mockProperties);

            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("L_SystemPrice <= ?"), [600000, 20, 0]);
        });

        test("filters by beds", async () => {
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    L_Keyword2: 4
                },
                {
                    L_ListingID: "1516171819",
                    L_Keyword2: 2
                }
            ];

            pool.query
                .mockResolvedValueOnce([[mockProperties[0]]])
                .mockResolvedValueOnce([[{ total: 1 }]]);

            const res = await request(app)
                .get("/api/properties")
                .query({ beds: 3 });

            expect(res.statusCode).toBe(200);
            expect(res.body.results).toEqual([mockProperties[0]]);

            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("L_Keyword2 >= ?"), [3, 20, 0]);
        });

        test("filters by baths", async () => {
            const mockProperties = [
                {
                    L_ListingID: "1011121314",
                    LM_Dec_3: 3
                },
                {
                    L_ListingID: "1516171819",
                    LM_Dec_3: 1
                }
            ];

            pool.query
                .mockResolvedValueOnce([[mockProperties[0]]])
                .mockResolvedValueOnce([[{ total: 1 }]]);

            const res = await request(app)
                .get("/api/properties")
                .query({ baths: 2 });

            expect(res.statusCode).toBe(200);
            expect(res.body.results).toEqual([mockProperties[0]]);

            expect(pool.query).toHaveBeenNthCalledWith(1, expect.stringContaining("LM_Dec_3 >= ?"), [2, 20, 0]);
        });
    });

    describe("invalid inputs", () => {
        test("rejects invalid limit", async () => {
            const res = await request(app)
                .get("/api/properties")
                .query({ limit: 101 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("limit must be a whole number between 1 and 100");
        });

        test("rejects invalid offset", async () => {
            const res = await request(app)
                .get("/api/properties")
                .query({ offset: -1 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("offset must be a whole number greater than or equal to 0");
        });

        test("rejects invalid minPrice", async () => {
            const res = await request(app)
                .get("/api/properties")
                .query({ minPrice: -1 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("minPrice must be a whole number greater than or equal to 0");
        });

        test("rejects invalid maxPrice", async () => {
            const res = await request(app)
                .get("/api/properties")
                .query({ maxPrice: -1 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("maxPrice must be a whole number greater than or equal to 0");
        });

        test("rejects minPrice greater than maxPrice", async () => {
            const res = await request(app)
                .get("/api/properties")
                .query({ minPrice: 500000, maxPrice: 300000 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("minPrice must be less than maxPrice");
        });

        test("rejects invalid beds", async () => {
            const res = await request(app)
                .get("/api/properties")
                .query({ beds: -1 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("beds must be a whole number greater than or equal to 0");
        });

        test("rejects invalid baths", async () => {
            const res = await request(app)
                .get("/api/properties")
                .query({ baths: -1 });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe("baths must be a whole number greater than or equal to 0");
        });
    });
});

describe("GET /api/properties/:id", () => {
    test("returns property successfully", async () => {
        const mockProperty = {
            L_ListingID: "1011121314",
            L_City: "Chicago",
            L_SystemPrice: 800000
        };

        pool.query.mockResolvedValueOnce([[mockProperty]]);

        const res = await request(app)
            .get("/api/properties/1011121314");

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual(mockProperty);

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM rets_property WHERE L_ListingID = ?",
            ["1011121314"]
        );
    });

    test("returns 404 when property is not found", async () => {
        pool.query.mockResolvedValueOnce([[]]);

        const res = await request(app)
            .get("/api/properties/4546474849");

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Property not found");

        expect(pool.query).toHaveBeenCalledWith(
            "SELECT * FROM rets_property WHERE L_ListingID = ?",
            ["4546474849"]
        );
    });

    test("rejects invalid property ID", async () => {
        const invalidId = "123".repeat(90);

        const res = await request(app)
            .get(`/api/properties/${invalidId}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Invalid listing ID");

        // database should not be called for an invalid ID
        expect(pool.query).not.toHaveBeenCalled();
    });
});

describe("GET /api/properties/:id/openhouses", () => { 
    test("returns open houses successfully", async () => {
        const mockProperty = {
            L_ListingID: "1011121314",
            L_City: "Los Angeles"
        };

        const mockOpenHouses = [
            {
                L_ListingID: "1011121314",
                OpenHouseDate: "2026-09-01",
                OH_StartTime: "10:00:00"
            }
        ];

        pool.query
            .mockResolvedValueOnce([[mockProperty]])
            .mockResolvedValueOnce([mockOpenHouses]);

        const res = await request(app)
            .get("/api/properties/1011121314/openhouses");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockOpenHouses);

        expect(pool.query).toHaveBeenNthCalledWith(1, "SELECT * FROM rets_property WHERE L_ListingID = ?", ["1011121314"]);
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining("FROM rets_openhouse WHERE L_ListingID = ?"), ["1011121314"]);
    });

    test("returns empty array when property has no open houses", async () => {
        const mockProperty = {
            L_ListingID: "1011121314"
        };

        pool.query
            .mockResolvedValueOnce([[mockProperty]])
            .mockResolvedValueOnce([[]]);

        const res = await request(app)
            .get("/api/properties/1011121314/openhouses");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);

        expect(pool.query).toHaveBeenNthCalledWith(1, "SELECT * FROM rets_property WHERE L_ListingID = ?", ["1011121314"]);
        expect(pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining("FROM rets_openhouse WHERE L_ListingID = ?"), ["1011121314"]);
    });

    test("returns 404 when property is not found", async () => {
        pool.query.mockResolvedValueOnce([[]]);

        const res = await request(app)
            .get("/api/properties/9999999999/openhouses");

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Property not found");

        expect(pool.query).toHaveBeenNthCalledWith(1, "SELECT * FROM rets_property WHERE L_ListingID = ?", ["9999999999"]);
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
});