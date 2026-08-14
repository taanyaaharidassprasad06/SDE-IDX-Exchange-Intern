import { useContext } from "react";
import FavoritesContext from "../context/FavoritesContext";

function useFavorites() {
    return useContext(FavoritesContext);
}

export default useFavorites;