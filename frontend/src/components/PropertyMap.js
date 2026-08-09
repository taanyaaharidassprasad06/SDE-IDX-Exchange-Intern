function PropertyMap({ latitude, longitude }) {
    if (!latitude || !longitude) {
        return <p>Map unavailable</p>;
    }

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=15`;

    return (
        <div className="property-map">
            <iframe
                src={mapUrl}
                title="Property location"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
            />
        </div>
    );
}

export default PropertyMap;