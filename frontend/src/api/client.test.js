import { fetchProperties } from "./client";

// replace browser fetch() with a fake Jest function so tests do not make real API calls to backend
global.fetch = jest.fn();

describe("fetchProperties API", () => {
    test("returns property data when fetch succeeds", async () => {
        
        // mock successful backend response
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                total: 1, // mock length
                results: [{ id: 1 }]
            })
        });

        // call real fetchProperties but the fetch inside that function is mocked so no real request is sent
        const data = await fetchProperties();

        // check function returned expected data which is 1
        expect(data.results).toHaveLength(1);
    });

    test("includes query parameters in the request URL", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                total: 0,
                results: []
            })
        });
        
        await fetchProperties({
            city: "Chicago",
            beds: "3"
        });

        expect(fetch).toHaveBeenCalledWith("/api/properties?city=Chicago&beds=3");
    });

    test("throws an error when fetch fails", async () => {
        
        // mock failed API response
        fetch.mockResolvedValue({
            ok: false
        });

        // verify fetchProperties throws an error
        await expect(fetchProperties()).rejects.toThrow("Unable to load properties. Please try again later.");
    });
});







