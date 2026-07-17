export async function fetchProperties(params = {}) { 
    const queryParams = new URLSearchParams(params); // converts object into a URL query string

    // fetch sends the request to the frontend server and the proxy forwards it to the backend server
    // proxy is a middleman that forwards requests from the frontend to the backend server
    const response = await fetch(`/api/properties?${queryParams}`);

    if(!response.ok) {
        throw new Error("Unable to load properties. Please try again later.");
    }

    // converts the backend's JSON response into a JavaScript object
    return response.json();
}

export async function fetchPropertyDetails(id) {
    const response = await fetch(`/api/properties/${id}`);

    if(!response.ok) {
        throw new Error("Unable to load property details. Please try again later.");
    }

    return response.json();
}