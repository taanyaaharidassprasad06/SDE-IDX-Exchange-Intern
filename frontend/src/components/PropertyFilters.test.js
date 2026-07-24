import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';

describe("PropertyFilters component", () => {
    test("renders all filter inputs", () => {
        render(<PropertyFilters onSearch={jest.fn()}/>);

        expect(screen.getByRole("textbox", { name: /city/i })).toBeInTheDocument();
        expect(screen.getByRole("textbox", { name: /zip/i })).toBeInTheDocument();

        expect(screen.getByRole("spinbutton", { name: /min/i })).toBeInTheDocument();
        expect(screen.getByRole("spinbutton", { name: /max/i })).toBeInTheDocument();

        expect(screen.getByRole("combobox", { name: /beds/i })).toBeInTheDocument();
        expect(screen.getByRole("combobox", { name: /baths/i })).toBeInTheDocument();
    });

    test("updates city input when user types", () => {
        render(<PropertyFilters onSearch={jest.fn()}/>);

        const city = screen.getByRole("textbox", { name: /city/i });

        // simulate user typing into the field
        fireEvent.change(city, {
            target: { value: "Chicago" }
        });

        expect(city).toHaveValue("Chicago");
    });

    test("calls onSearch function with filters when form is submitted", () => {
        const mockSearch = jest.fn();

        render(<PropertyFilters onSearch={mockSearch}/>);

        const city = screen.getByRole("textbox", { name: /city/i });

        fireEvent.change(city, {
            target: { value: "Chicago" }
        });

        const searchButton = screen.getByRole("button", { name: /search/i });

        // submit form
        fireEvent.click(searchButton);

        // verify ListingsPage receives the correct filter object
        expect(mockSearch).toHaveBeenCalledWith({
            city: "Chicago",
            zipcode: "",
            minPrice: "",
            maxPrice: "",
            beds: "",
            baths: ""
        });
    });

    test("clears filters and calls onSearch with empty filters", () => {
        const mockSearch = jest.fn();

        render(<PropertyFilters onSearch={mockSearch}/>);

        const city = screen.getByRole("textbox", { name: /city/i });

        fireEvent.change(city, {
            target: { value: "Chicago" }
        });

        const clearButton = screen.getByRole("button", { name: /clear/i });

        fireEvent.click(clearButton);

        expect(city).toHaveValue("");

        expect(mockSearch).toHaveBeenCalledWith({
            city: "",
            zipcode: "",
            minPrice: "",
            maxPrice: "",
            beds: "",
            baths: ""
        });
    });
});
