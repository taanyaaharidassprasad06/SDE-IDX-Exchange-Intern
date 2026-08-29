import { useState, useEffect, useRef } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import Pagination from "../components/Pagination";
import './ListingsPage.css';

function ListingsPage() {
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({});
    
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const[currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    
    const offset = (currentPage - 1) * itemsPerPage;
    const startItem = offset + 1;
    const endItem = Math.min(offset + itemsPerPage, total);

    const latestRequestId = useRef(0); // stores ID of most recent API request

    useEffect(() => {
        async function loadProperties() {
            // assign a unique ID to this API request
            // latest request ID is stored in ref so it persists across rerenders
            const requestId = ++latestRequestId.current;

            setLoading(true);
            setError(null);

            try {
                //await new Promise(resolve => setTimeout(resolve, 3000));
                
                const data = await fetchProperties({
                    limit: itemsPerPage, 
                    offset: offset, 
                    ...filters
                });
                
                // ignore this response if a newer request was made while waiting
                // prevents older API responses from overwriting newer search results
                if(requestId !== latestRequestId.current) {
                    return;
                }

                setProperties(data.results); // response.json({ total, limit, offset, results: rows });
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

        loadProperties();
    }, [currentPage, itemsPerPage, filters, offset]);

    function handlePageChange(page) {
        setCurrentPage(page);
        window.scrollTo({top: 0, behavior: "smooth"});
    }

    function handleSearch(newFilters) {
        const params = Object.entries(newFilters) // turns object into array structure (ex. [["city", "Chicago"], ["beds", "3"]])
        const filteredParams = params.filter(([key, value]) => value !== "") // removes empty string values
        const cleanParams = Object.fromEntries(filteredParams) // converts array structure back into object

        setFilters(cleanParams); // save active filters for pagination
        setCurrentPage(1); // reset to first page when filters change
    }

    return (
        <div>
            <PropertyFilters onSearch={handleSearch}/>
            {loading && <p>Loading properties...</p>}
            {error && <p>{error}</p>}
            {(!loading && !error) && 
            <div>
                {properties.length === 0 ? <p>No properties found.</p> : 
                <p>Showing {startItem}-{endItem} of {total} properties</p>}
                <div className="listings-grid">
                    {properties.map((property, i) => (
                        <PropertyCard key={property.L_ListingID} property={property}/>
                    ))}
                </div>
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} total={total} onPageChange={handlePageChange}/>
            </div>
            }
        </div>
    );
}

export default ListingsPage;