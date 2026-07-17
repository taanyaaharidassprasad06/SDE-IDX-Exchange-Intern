import { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";

function ListingsPage() {

    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProperties() {
            try {
                // TEST LOADING STATE: wait 3 seconds before fetching
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                const data = await fetchProperties();
                setProperties(data.results); // response.json({ total, limit, offset, results: rows });
                setTotal(data.total);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            } 
        }

        loadProperties();
    }, []);


    return (
        <div>
            {loading && <p>Loading properties...</p>}
            {error && <p>{error}</p>}
            {(!loading && !error) && 
            <div>
                <p>Showing {properties.length} of {total} properties</p>
                <div className="listings-grid">
                    {properties.map(property => (
                        <PropertyCard property={property}/>
                    ))}
                </div>
            </div>
            }
        </div>
    );
}

export default ListingsPage;