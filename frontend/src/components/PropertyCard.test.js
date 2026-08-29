import { render, screen, fireEvent } from "@testing-library/react";
import PropertyCard from "./PropertyCard";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate
}));

jest.mock("../hooks/useFavorites", () => ({
    __esModule: true,
    default: () => ({
        addFavorite: jest.fn(),
        removeFavorite: jest.fn(),
        isFavorite: jest.fn(() => false)
    })
}));

describe("PropertyCard component", () => {
    const mockProperty = {
        L_ListingID: "123",
        L_SystemPrice: 500000,
        L_City: "Dallas",
        L_State: "TX",
        L_Address: "123 Texas Rd",
        L_Keyword2: 3,
        LM_Dec_3: 2,
        LM_Int2_3: 1500,
        L_Photos: JSON.stringify(["photo1.jpg"])
    };

    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test("renders property data", () => {
        render(<PropertyCard property={mockProperty} />);

        expect(screen.getByText("$500k")).toBeInTheDocument();
        expect(screen.getByText("123 Texas Rd")).toBeInTheDocument();
        expect(screen.getByText("Dallas, TX")).toBeInTheDocument();
        expect(screen.getByText("3 bed")).toBeInTheDocument();
        expect(screen.getByText("2 bath")).toBeInTheDocument();
        expect(screen.getByText("1500 sqft")).toBeInTheDocument();
    });

    test("clicking the card navigates to the property detail page", () => {
        render(<PropertyCard property={mockProperty} />);

        fireEvent.click(screen.getByText("123 Texas Rd"));

        expect(mockNavigate).toHaveBeenCalledWith("/property/123");
    });
});