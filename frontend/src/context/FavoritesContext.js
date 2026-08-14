import { createContext, useState, useEffect } from "react";

// creates a context to share favorite properties across the application
const FavoritesContext = createContext();

// provides favorite properties and related functions to all child components
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // load saved favorites from localStorage when the app first loads
    useEffect(() => {
        const savedFavorites = localStorage.getItem("favorites");

        if(savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // add a property to favorites and save the updated list to localStorage
    function addFavorite(property) {
        // use the functional update form here (prev => ...) instead of setFavorites([...favorites, property])
        // react calls this arrow function and when it calls it it passes in the current state as "prevFavorites"
        // this matters because "favorites" might not have the latest value when the update happens
        // using "prevFavorites" makes sure the new list is built from the latest state
        setFavorites(prevFavorites => {
            const updatedFavorites = [...prevFavorites, property];
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    }

    // remove a property from favorites and save the updated list to localStorage
    function removeFavorite(listingId) {
        setFavorites(prevFavorites => {
            const updatedFavorites = prevFavorites.filter(property => property.L_ListingID !== listingId);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        })
    }

    // check whether a property is currently in the favorites list
    function isFavorite(listingId) {
        return favorites.some(property => property.L_ListingID === listingId);
    }

    // make favorites state and functions available to all child components
    return (
        <FavoritesContext.Provider 
            value={{
                favorites, 
                addFavorite,
                removeFavorite,
                isFavorite
            }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export default FavoritesContext;