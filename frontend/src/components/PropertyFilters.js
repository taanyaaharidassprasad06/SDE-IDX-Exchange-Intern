import { useState, useEffect } from "react";

function PropertyFilters({ onSearch }) {
    const initialFilters = {
        city: "",
        zipcode: "",
        minPrice: "",
        maxPrice: "",
        beds: "",
        baths: ""
    }

    const [filters, setFilters] = useState(initialFilters);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto"; // prevents page from scrolling when sidebar is open
    }, [isOpen]);
    
    
    function handleSubmit(e) {
        e.preventDefault();
        onSearch(filters);
    }

    function handleClear(e) {
        e.preventDefault();
        onSearch(initialFilters);
        setFilters(initialFilters);
    }

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className="menu">☰</button>
            {isOpen && <div onClick={() => setIsOpen(!isOpen)} className="overlay"></div>}
            <div className={`form-container ${isOpen ? "open" : ""}`}>
                <form onSubmit={handleSubmit} className="form">
                    <div className="filter-form">
                        <div className="filter">
                        <label className="label" htmlFor="city">CITY</label>
                        <input 
                            className="field"
                            id="city"
                            type="text"
                            name="city"
                            placeholder="Palo Alto"
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        />
                        </div>
                        <div className="filter">
                            <label className="label" htmlFor="zipcode">ZIP</label>
                            <input 
                                className="field"
                                id="zipcode"
                                type="text"
                                name="zipcode"
                                placeholder="94301"
                                value={filters.zipcode}
                                onChange={(e) => setFilters({...filters, zipcode: e.target.value})}
                            />
                        </div>
                        <div className="filter">
                            <label className="label" htmlFor="minPrice">MIN $</label>
                            <input 
                                className="field"
                                id="minPrice"
                                type="number"
                                name="minPrice"
                                placeholder="0"
                                value={filters.minPrice}
                                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                            />
                        </div>
                        <div className="filter">
                            <label className="label" htmlFor="maxPrice">MAX $</label>
                            <input 
                                className="field" 
                                id="maxPrice"
                                type="number"
                                name="maxPrice"
                                placeholder="Any"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                            />
                        </div>
                        <div className="filter">
                            <label className="label" htmlFor="beds">BEDS</label>
                            <select 
                                className="field" 
                                id="beds" 
                                name="beds"
                                value={filters.beds}
                                onChange={(e) => setFilters({...filters, beds: e.target.value})}
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                        <div className="filter">
                            <label className="label" htmlFor="baths">BATHS</label>
                            <select 
                                className="field" 
                                id="baths"
                                name="baths"
                                value={filters.baths}
                                onChange={(e) => setFilters({...filters, baths: e.target.value})}
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-btn">
                        <button className="clear-btn" type="button" onClick={handleClear}>Clear Filters</button>
                        <button className="submit-btn" type="submit">Search</button>
                    </div>
                </form>
            </div>
        </>
        
    );
}

export default PropertyFilters;