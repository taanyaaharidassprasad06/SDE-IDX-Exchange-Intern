import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFavorites from "../hooks/useFavorites";
import { fetchPropertyDetails, fetchOpenHouses } from "../api/client";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import './PropertyDetailPage.css';

function PropertyDetailPage() {
    const { id } = useParams(); // gets the id value from /property/:id URL route
    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [error, setError] = useState(null);

    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const favorite = property ? isFavorite(property.L_ListingID) : false;


    useEffect(() => {
        async function loadProperty() {
            try {
                // fetch property details for property
                const data = await fetchPropertyDetails(id);
                setProperty(data);

                try {
                    const photos = data.L_Photos ? JSON.parse(data.L_Photos) : []; // parse the JSON photos list or use an empty array if no photos exist
                    setPropertyImages(Array.isArray(photos) ? photos : []); // store photos if the parsed data is an array or use empty array
                } catch (error) {
                    setPropertyImages([]);
                }

                // fetch openhouses for property
                const openHouseData = await fetchOpenHouses(id);
                setOpenHouses(openHouseData);
            } catch (error) {
                setError(error.message);
            }
        }

        loadProperty();
    }, [id]);

    function handleFavorite() {
        addFavorite(property);
    }

    function handleRemoveFavorite() {
        removeFavorite(property.L_ListingID);
    }

    return (
        <div>
            {error && <p>{error}</p>}
            {property && (
                <div>
                    <div className="introduction">
                        <PropertyImageGallery photos={propertyImages}/>
                        <div className="intro-container">
                            <div className="intro-details">
                                <p className="listing-id">{property.L_ListingID}</p>
                                <div className="listing-loc">
                                    <h1 className="listing-price">${property.L_SystemPrice}</h1>
                                    <p>{property.L_Address}</p>
                                    <p>{property.L_City}, {property.L_State}, {property.L_Zip}</p>
                                </div>
                                <div className="listing-details">
                                    <div>
                                        <p className="amount">{property.L_Keyword2}</p>
                                        <p className="category">BEDS</p>
                                    </div>
                                    <div>
                                        <p className="amount">{property.LM_Dec_3}</p>
                                        <p className="category">BATHS</p>
                                    </div>
                                    <div>
                                        <p className="amount">{property.LM_Int2_3}</p>
                                        <p className="category">SQ FT</p>
                                    </div>
                                    <div>
                                        <p className="amount">{property.YearBuilt}</p>
                                        <p className="category">BUILT</p>
                                    </div>
                                </div>
                            </div>
                            <div className="fav-btn-container">
                                <button className="favorites-btn" onClick={handleFavorite} disabled={favorite}>Add to Favorites</button>
                                <button className="remove-favorites-btn" onClick={handleRemoveFavorite} disabled={!favorite}>Remove from Favorites</button>
                            </div>
                        </div>
                    </div>
                    <div className="property-more-details-container">
                        <div>
                            <div className="about-home">
                                <h2>About this home</h2>
                                <p>{property.L_Remarks}</p>
                            </div>
                            <div>
                                <h2>Property Details</h2>
                                <div className="property-more-details">
                                    <div className="detail-card">
                                        <p className="detail-card-title">Type</p>
                                        <p className="detail-card-value">{property.L_Class}</p>
                                    </div>
                                    <div className="detail-card">
                                        <p className="detail-card-title">View</p>
                                        <p className="detail-card-value">{property.View}</p>
                                    </div>
                                    <div className="detail-card">
                                        <p className="detail-card-title">Lot Size</p>
                                        <p className="detail-card-value">{property.L_Keyword1} Sq Ft</p>
                                    </div>
                                    <div className="detail-card">
                                        <p className="detail-card-title">Garage Space</p>
                                        <p className="detail-card-value">{property.L_Keyword5} Car</p>
                                    </div>
                                    <div className="detail-card">
                                        <p className="detail-card-title">Floors</p>
                                        <p className="detail-card-value">{property.StoriesTotal} Stories</p>
                                    </div>
                                    <div className="detail-card">
                                        <p className="detail-card-title">Cooling / Heating</p>
                                        <p className="detail-card-value">{property.Cooling} / {property.Heating}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="openhouse">
                            <h3>Open Houses</h3>
                            {openHouses.length > 0 ? (
                                openHouses.map((openHouse, index) => {
                                    const allData = JSON.parse(openHouse.all_data);
                                    const date = new Date(openHouse.OpenHouseDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric"})
                                    return (
                                        <div key={index} className="openhouse-card">
                                            <p className="oh-card-date">{date}</p>
                                            <p>{openHouse.OH_StartTime} - {openHouse.OH_EndTime}</p>
                                            <p className="oh-card-remarks">Remarks: {allData.OpenHouseRemarks}</p>
                                        </div>
                                    )
                                })
                            ) : (
                                <p>No openhouses scheduled.</p>
                            )}
                        </div>
                    </div>
                    <div className="map">
                        <h2>Location</h2>
                        <PropertyMap latitude={property.LMD_MP_Latitude} longitude={property.LMD_MP_Longitude}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyDetailPage;