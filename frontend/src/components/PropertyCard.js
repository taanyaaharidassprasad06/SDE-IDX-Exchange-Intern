function PropertyCard({ property }) {
    const cityState = `${property.L_City}, ${property.L_State}` ;
    let propertyImages = []
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
        <div className="property-card">
            <div className="property-img-container">
                {image ? <img className="property-img" src={image} alt={property.L_Address}/> : <div className="no-img">No image to display</div>}
            </div>
            <div className="property-logistics-container">
                <div className="property-logistics">
                    <h3>{property.L_SystemPrice}</h3>
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
                        <p>{property.LotSizeSquareFeet} sqft</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyCard;