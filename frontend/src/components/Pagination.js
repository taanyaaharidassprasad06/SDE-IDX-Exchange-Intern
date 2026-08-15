import './Pagination.css';

function Pagination({ currentPage, itemsPerPage, total, onPageChange }) {
    
    const totalPages = Math.ceil(total / itemsPerPage);

    const pages = [];

    // CASE 0: pagination bar is hidden when totalPages is  <= 1
    if(totalPages <= 1) {
        return null;
    }

    // CASE 1: total pages are small enough to show every page number
    if(totalPages <= 7) {
        for(let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    }

    // CASE 2: current page is near the beginning
    else if(currentPage <= 4) {
        for(let i = 1; i <= 5; i++) {
            pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
    }

    // CASE 3: current page is near the end
    else if(currentPage >= totalPages - 4) {
        pages.push(1);
        pages.push("...");
        for(let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
        }
    }

    // CASE 4: current page is in the middle
    else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
    }
    
    return (
        <nav className="pagination">
            <button className="pagination-btn prev-next-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>&lsaquo;</button>
            {pages.map((page, index) => 
                page === "..." ? (
                    <span key={index}>...</span>
                ) : (
                    <button key={index} className="pagination-btn num-nav-btn" onClick={() => onPageChange(page)} disabled={page === currentPage}>{page}</button>
                )
            )}
            <button className="pagination-btn prev-next-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>&rsaquo;</button>
        </nav>
    );
}

export default Pagination;