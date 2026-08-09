import { useState, useEffect, useRef } from "react";

function PropertyImageGallery({ photos }) {
    const [currIndex, setCurrIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    // useRef gives way to directly access the actual <dialog> DOM element after React renders it
    // start with null because <dialog> does not exist in DOM until modalOpen becomes true and React renders it
    // once React renders <dialog ref={dialogRef}> React sets: dialogRef.current = the actual <dialog> element
    // then can call dialog's built-in browser methods like showModal() and close()
    const dialogRef = useRef(null);

    useEffect(() => {
        if (modalOpen) {
            dialogRef.current.showModal(); // open dialog as a modal if modalOpen is true
        } else if (dialogRef.current?.open) { // prevents error if dialog does not exist yet
            dialogRef.current.close();
        }
    }, [modalOpen]);

    function openModal() {
        setModalOpen(true);
    }

    function showPrev(event) {
        // prevent button click from bubbling up to dialog's onClick() which would close the modal
        event.stopPropagation();
        setCurrIndex((i) => (i - 1 + photos.length) % photos.length);
    }

    function showNext(event) {
        event.stopPropagation();
        setCurrIndex((i) => (i + 1) % photos.length);
    }

    function handleKeyDown(event) {
        if (event.key === "ArrowLeft") { // left arrow moves to previous photo
            setCurrIndex((i) => (i - 1 + photos.length) % photos.length);
        } else if (event.key === "ArrowRight") { // right arrow moves to next photo
            setCurrIndex((i) => (i + 1) % photos.length);
        }
        
        // escape key is handled automatically by <dialog>
    }

    if (photos.length === 0) {
        return <div className="no-img">No image to display</div>;
    }

    return (
        <div className="property-gallery">
            {/* Main image. Clicking it opens the image modal. */}
            <img
                className="gallery-main-img"
                src={photos[currIndex]}
                alt="property"
                onClick={openModal}
            />

            {/* Thumbnail strip allows the user to select a specific photo */}
            <div className="thumbnail-strip">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        className="gallery-thumbnail"
                        src={photo}
                        alt={`Property ${index + 1}`}
                        onClick={() => setCurrIndex(index)}
                    />
                ))}
            </div>

            <dialog
                ref={dialogRef}
                className="image-modal"
                onClose={() => setModalOpen(false)}
                onClick={() => setModalOpen(false)}
                onKeyDown={handleKeyDown}
            >
                <img
                    src={photos[currIndex]}
                    alt="property enlarged"
                    onClick={(event) => event.stopPropagation()}
                />
                <div>
                    {photos.length > 1 && (
                        <button
                            type="button"
                            className="modal-arrow modal-arrow-left"
                            onClick={showPrev}
                            aria-label="Previous image"
                        >
                            prev
                        </button>
                    )}
                    {photos.length > 1 && (
                        <button
                            type="button"
                            className="modal-arrow modal-arrow-right"
                            onClick={showNext}
                            aria-label="Next image"
                        >
                            next
                        </button>
                    )}
                </div>
            </dialog>
        </div>
    );
}

export default PropertyImageGallery;