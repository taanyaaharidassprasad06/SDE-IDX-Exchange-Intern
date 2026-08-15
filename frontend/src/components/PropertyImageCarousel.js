import { useState } from "react";
import './PropertyImageCarousel.css';

function PropertyImageCarousel({ photos }) {
    const [currIndex, setCurrIndex] = useState(0); // track which photo is currently being displayed

    function previousPhoto(event) {
        // prevent click from bubbling up to property card which has its own onClick that navigates to detail page
        // allows arrow to change the carousel image without navigating away from listings page
        event.stopPropagation();

        // move to the previous photo or wrap around to last photo
        // index 0 = wrap around to last photo
        const prevIndex = (currIndex - 1 + photos.length) % photos.length;

        setCurrIndex(prevIndex);
    }

    function nextPhoto(event) {
        event.stopPropagation();

        // move to the previous photo or wrap around to first photo
        // last index = wrap around to index 0
        const nextIndex = (currIndex + 1) % photos.length;

        setCurrIndex(nextIndex);
    }

    return (
        <div className="property-carousel">
            <img className="property-img" src={photos[currIndex]} alt="property"/>
            {photos.length > 1 && (
                <div>
                    <button className="carousel-prev" onClick={previousPhoto}>&lsaquo;</button>
                    <button className="carousel-next" onClick={nextPhoto}>&rsaquo;</button>
                    <p className="carousel-counter">{currIndex + 1}/{photos.length}</p>
                </div>
            )}
        </div>
    );
}

export default PropertyImageCarousel;