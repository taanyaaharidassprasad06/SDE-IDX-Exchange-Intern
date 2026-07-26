export default function formatPrice(price) {
    if(price === null || price === "") {
        return "";
    }

    const num = Number(price);
    
    if(isNaN(num)) {
        return "";
    }

    const abs = Math.abs(num);

    const sign = num < 0 ? "-" : "";

    if(abs >= 1_000_000) {
        return `${sign}$${trimTrailingZero(abs / 1_000_000)}M`;
    }

    if(abs >= 1_000) {
        return `${sign}$${trimTrailingZero(abs / 1_000)}k`;
    }

    return `${sign}$${abs.toLocaleString()}`;
}

function trimTrailingZero(value) {
    return Number(value.toFixed(2).toString());
}

