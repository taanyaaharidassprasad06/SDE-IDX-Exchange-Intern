import { useState, useEffect, useRef } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";

function ListingsPage() {

    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const latestRequestId = useRef(0); // stores ID of most recent API request

    useEffect(() => {
        async function loadProperties() {
            const requestId = ++latestRequestId.current;

            try {
                //await new Promise(resolve => setTimeout(resolve, 3000));
                
                const data = await fetchProperties();
                
                if(requestId !== latestRequestId.current) {
                    return;
                }

                setProperties(data.results); // response.json({ total, limit, offset, results: rows });
                setTotal(data.total);
            } catch (error) {
                if(requestId === latestRequestId.current) {
                    setError(error.message);
                }
            } finally {
                if(requestId === latestRequestId.current) {
                    setLoading(false);
                }
            }
        }

        loadProperties();
    }, []);

    async function handleSearch(filters) {
        // assign a unique ID to this API request
        // latest request ID is stored in ref so it persists across rerenders
        const requestId = ++latestRequestId.current; 

        setLoading(true);
        setError("");

        const params = Object.entries(filters) // turns object into array structure (ex. [["city", "Chicago"], ["beds", "3"]])
        const filteredParams = params.filter(([key, value]) => value !== "") // removes empty string values
        const cleanParams = Object.fromEntries(filteredParams) // converts array structure back into object

        try {
            const data = await fetchProperties(cleanParams);

            // ignore this response if a newer request was made while waiting
            // prevents older API responses from overwriting newer search results
            if(requestId !== latestRequestId.current) {
                return;
            }

            setProperties(data.results);
            setTotal(data.total);
        
        // only update error and loading states for the most recent request
        } catch (error) {
            if(requestId === latestRequestId.current) {
                setError(error.message);
            }
        } finally {
            if(requestId === latestRequestId.current) {
                setLoading(false);
            }
        }
    }

    return (
        <div>
            {loading && <p>Loading properties...</p>}
            {error && <p>{error}</p>}
            {(!loading && !error) && 
            <div>
                <PropertyFilters onSearch={handleSearch}/>
                {properties.length === 0 ? <p>No properties found.</p> : 
                <p>Showing {properties.length} of {total} properties</p>}
                <div className="listings-grid">
                    {properties.map((property, i) => (
                        <PropertyCard key={i} property={property}/>
                    ))}
                </div>
            </div>
            }
        </div>
    );
}

export default ListingsPage;