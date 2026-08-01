import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe("Pagination component", () => {
    test("case 0: pagination hidden when there is only one page", () => {
        const { container } = render(<Pagination currentPage={1} itemsPerPage={20} total={10} onPageChange={jest.fn()}/>);

        expect(container.firstChild).toBeNull();
    });

    test("case 1: renders all page numbers when total pages are small", () => {
        render(<Pagination currentPage={1} itemsPerPage={20} total={100} onPageChange={jest.fn()}/>);

        // expected: 1 2 3 4 5
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument(); 
    });

    test("case 2: renders ellipses when current page is near the beginning", () => {
        render(<Pagination currentPage={3} itemsPerPage={20} total={480} onPageChange={jest.fn()}/>);

        // expected: 1 2 3 4 5... 24
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument(); 
        expect(screen.getAllByText("...")).toHaveLength(1);
        expect(screen.getByRole("button", { name: "24" })).toBeInTheDocument(); 
    });

    test("case 3: renders ellipses when current page is near the end", () => {
        render(<Pagination currentPage={22} itemsPerPage={20} total={480} onPageChange={jest.fn()}/>);

        // expected: 1 ... 20 21 22 23 24
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getAllByText("...")).toHaveLength(1);
        expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "21" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "22" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "23" })).toBeInTheDocument(); 
        expect(screen.getByRole("button", { name: "24" })).toBeInTheDocument(); 
    });

    test("case 4: renders ellipses when current page is in the middle", () => {
        render(<Pagination currentPage={12} itemsPerPage={20} total={480} onPageChange={jest.fn()}/>);

        // expected: 1 ... 11 12 13 ... 24
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "11" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "12" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "13" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "24" })).toBeInTheDocument(); 

        expect(screen.getAllByText("...")).toHaveLength(2);
    });

    test("disables previous button on first page", () => {
        render(<Pagination currentPage={1} itemsPerPage={20} total={480} onPageChange={jest.fn()}/>);

        expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    });

    test("disables next button on last page", () => {
        render(<Pagination currentPage={24} itemsPerPage={20} total={480} onPageChange={jest.fn()}/>);

        expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    });

    test("disables current page button", () => {
        render(<Pagination currentPage={3} itemsPerPage={20} total={480} onPageChange={jest.fn()}/>);

        expect(screen.getByRole("button", { name: "3" })).toBeDisabled();
    });

    test("calls onPageChange when a page number is clicked", () => {
        const mockPageChange = jest.fn();

        render(<Pagination currentPage={1} itemsPerPage={20} total={480} onPageChange={mockPageChange}/>);

        fireEvent.click(screen.getByRole("button", { name: "3"} ));

        expect(mockPageChange).toHaveBeenCalledWith(3);
    });

    test("does not duplicate the last page number near the end", () => {
        render(<Pagination currentPage={22} itemsPerPage={20} total={480} onPageChange={jest.fn()}/>);

        // expected: 1 ... 20 21 22 23 24
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "21" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "22" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "23" })).toBeInTheDocument(); 
        expect(screen.getByRole("button", { name: "24" })).toBeInTheDocument(); 

        expect(screen.getAllByRole("button", { name: "24" })).toHaveLength(1);
    });
});
