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

    test("updates all filter inputs", () => {
        render(<PropertyFilters onSearch={jest.fn()}/>);

        fireEvent.change(screen.getByRole("textbox", { name: /zip/i }), {
            target: { value: "97219" }
        });

        fireEvent.change(screen.getByRole("spinbutton", { name: /min/i }), {
            target: { value: "300000" }
        });

        fireEvent.change(screen.getByRole("spinbutton", { name: /max/i }), {
            target: { value: "600000" }
        });

        fireEvent.change(screen.getByRole("combobox", { name: /beds/i }), {
            target: { value: "3" }
        });

        fireEvent.change(screen.getByRole("combobox", { name: /baths/i }), {
            target: { value: "2" }
        });

        expect(screen.getByRole("textbox", { name: /zip/i })).toHaveValue("97219");
        expect(screen.getByRole("spinbutton", { name: /min/i })).toHaveValue(300000);
        expect(screen.getByRole("spinbutton", { name: /max/i })).toHaveValue(600000);
        expect(screen.getByRole("combobox", { name: /beds/i })).toHaveValue("3");
        expect(screen.getByRole("combobox", { name: /baths/i })).toHaveValue("2");
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

    test("opens and closes filter menu", () => {
        render(<PropertyFilters onSearch={jest.fn()}/>);

        const menuButton = screen.getByRole("button", { name: "☰" });

        fireEvent.click(menuButton);

        expect(document.querySelector(".overlay")).toBeInTheDocument();

        fireEvent.click(document.querySelector(".overlay"));

        expect(document.querySelector(".overlay")).not.toBeInTheDocument();
    });
});
