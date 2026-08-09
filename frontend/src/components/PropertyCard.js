import formatPrice from "../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";

function PropertyCard({ property }) {
    const navigate = useNavigate();
    const cityState = `${property.L_City}, ${property.L_State}` ;
    let propertyImages = [];
    let image = "";
    
    try {
        // L_Photos is an empty string for properties with no photos
        // Only parse if a value exists
        if(property.L_Photos) {
            propertyImages = JSON.parse(property.L_Photos);
        }

        // Ensure that the parsed data is an array and that the array contains atleast 1 photo
        if(Array.isArray(propertyImages) && propertyImages.length > 0) {
            image = propertyImages[0];
        }
        
    } catch {
        // JSON throws an error if data is invalid
        // Print a message and keep image string as ""
        console.log(`Invalid photo data for ${property.L_ListingID}`);
    }

    return (
        <div className="property-card" onClick={() => navigate(`/property/${property.L_ListingID}`)}>
            <div className="property-img-container">
                {image ? <PropertyImageCarousel photos={propertyImages}/> : <div className="no-img">No image to display</div>}
                <h3 className="price-overlay">{formatPrice(property.L_SystemPrice)}</h3>
            </div>
            <div className="property-logistics-container">
                <div className="property-logistics">
                    <div className="location">
                        <h5>{property.L_Address}</h5>
                        <p className="city-state">{cityState}</p>
                    </div>
                </div>
                <div className="property-interior">
                    <div className="interior">
                        <p>{property.L_Keyword2} bed</p>
                    </div>
                    <div className="interior">
                        <p>{property.LM_Dec_3} bath</p>
                    </div>
                    <div className="interior">
                        <p>{property.LM_Int2_3} sqft</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;