import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPropertyDetails, fetchOpenHouses } from "../api/client";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyMap from "./PropertyMap";

function PropertyDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // gets the id value from /property/:id URL route
    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [propertyImages, setPropertyImages] = useState([]);
    const [error, setError] = useState(null);

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
                    console.log(`Invalid photo data for ${data.L_ListingID}`);
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

    return (
        <div>
            <button onClick={() => navigate("/")}>
                Home
            </button>
            {error && <p>{error}</p>}
            {property && (
                <div>
                    <PropertyImageGallery photos={propertyImages}/>
                    <PropertyMap latitude={property.LMD_MP_Latitude} longitude={property.LMD_MP_Longitude}/>
                    <div>
                        <h2>{property.L_ListingID} listing id</h2>
                        <h2>{property.L_SystemPrice}</h2>
                        <h2>{property.L_Address}, {property.L_City}, {property.L_State}, {property.L_Zip}</h2>
                    </div>
                    <div>
                        <p>{property.L_Keyword2} beds</p>
                        <p>{property.LM_Dec_3} baths</p>
                        <p>{property.LM_Int2_3} sqft</p>
                        <p>{property.YearBuilt} year built</p>

                        <p>{property.L_Class}</p>
                        <p>{property.L_Keyword5} garage space</p>
                        <p>{property.L_Keyword1} lot size area</p>
                        <p>{property.StoriesTotal} stories</p>
                        <p>{property.L_Class}</p>
                        <p>{property.Heating} heat</p>
                        <p>{property.Cooling} cooling</p>
                        <p>{property.InteriorFeatures}</p>
                        <p>{property.View}</p>
                    </div>
                </div>
            )}

            <div>
                <h2>Open Houses</h2>
                {openHouses.length > 0 ? (
                    openHouses.map((openHouse, index) => {
                        const allData = JSON.parse(openHouse.all_data);
                        return (
                            <div key={index}>
                                <p>Date: {new Date(openHouse.OpenHouseDate).toLocaleDateString()}</p>
                                <p>Start: {openHouse.OH_StartTime}</p>
                                <p>End: {openHouse.OH_EndTime}</p>
                                <p>Remarks: {allData.OpenHouseRemarks}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No open houses scheduled</p>
                )}
            </div>
        </div>
    );
}

export default PropertyDetailPage;