import { useState, useCallback } from 'react';

const usePagination = <T>(items: T[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    // Calculate the total number of items to show up to the current page
    const totalItemsToShow = (page: number) => {
        if (page === 1) return itemsPerPage;
        return itemsPerPage + (page - 1) * (itemsPerPage + 1);
    };
    
    const totalPages = Math.ceil((items.length - itemsPerPage) / (itemsPerPage + 1)) + 1;
    const paginatedItems = items.slice(0, totalItemsToShow(currentPage));
    const hasMore = currentPage < totalPages;

    const loadMore = useCallback(() => {
        if (hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    }, [hasMore]);

    const resetPagination = useCallback(() => {
        setCurrentPage(1);
    }, []);

    return {
        paginatedItems,
        loadMore,
        hasMore,
        currentPage,
        totalPages,
        resetPagination,
    };
};

export default usePagination;
