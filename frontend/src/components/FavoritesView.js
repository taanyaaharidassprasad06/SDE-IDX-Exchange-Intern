import { useNavigate } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import PropertyCard from "./PropertyCard";

function FavoritesView() {
    const navigate = useNavigate();
    const { favorites } = useFavorites();

    return (
        <div>
            <button onClick={() => navigate("/")}>
                Home
            </button>
            <h2>Favorites</h2>

            {favorites.length === 0 ? (
                <p>No favorite properties yet. Click the heart on a property to save a favorite.</p>
            ) : (
                <div>
                    <p>Favorites ({favorites.length})</p>
                    <div className="listings-grid">
                        {favorites.map((property) => (
                            <PropertyCard key={property.L_ListingID} property={property}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FavoritesView;