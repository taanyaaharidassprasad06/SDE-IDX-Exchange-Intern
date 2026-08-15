import formatPrice from "../utils/formatPrice";
import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
import useFavorites from "../hooks/useFavorites";
import heartEmpty from "../assets/heartEmpty.png";
import heartFilled from "../assets/heartFilled.png";
import bed from "../assets/bed.png";
import bath from "../assets/bath.png";
import sqft from "../assets/sqft.png";
import './PropertyCard.css';

function PropertyCard({ property }) {
    const navigate = useNavigate();
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const favorite = isFavorite(property.L_ListingID);

    const cityState = `${property.L_City}, ${property.L_State}`;
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

    function handleFavorite(e) {
        e.stopPropagation();

        if(favorite) {
            removeFavorite(property.L_ListingID);
        } else {
            addFavorite(property);
        }
    }

    return (
        <div className="property-card" onClick={() => navigate(`/property/${property.L_ListingID}`)}>
            <div className="property-img-container">
                {image ? <PropertyImageCarousel photos={propertyImages}/> : <div className="no-img">No image to display</div>}
                <button className="fav-btn" onClick={(e) => handleFavorite(e)}>{favorite ? <img src={heartFilled} alt="remove from favorites"/> : <img src={heartEmpty} alt="add to favorites"/>}</button>
            </div>
            <div className="property-logistics-container">
                <div className="property-logistics">
                    <h3>{formatPrice(property.L_SystemPrice)}</h3>
                    <div className="location">
                        <p className="address">{property.L_Address}</p>
                        <p className="city-state">{cityState}</p>
                    </div>
                </div>
                <div className="property-interior">
                    <div className="interior">
                        <img src={bed} alt="bed icon"/>
                        <p>{property.L_Keyword2} bed</p>
                    </div>
                    <div className="interior">
                        <img src={bath} alt="bath icon"/>
                        <p>{property.LM_Dec_3} bath</p>
                    </div>
                    <div className="interior">
                        <img src={sqft} alt="sqft icon"/>
                        <p>{property.LM_Int2_3} sqft</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;