import useFavorites from "../hooks/useFavorites";
import PropertyCard from "./PropertyCard";

function FavoritesView() {
    const { favorites } = useFavorites();

    return (
        <div>
            <h2>Favorites</h2>
            {favorites.length === 0 ? (
                <p>No favorite properties yet. Click the heart on a property to add to youe favorites.</p>
            ) : (
                <div>
                    <p>You have {favorites.length} properties saved to your favorites.</p>
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