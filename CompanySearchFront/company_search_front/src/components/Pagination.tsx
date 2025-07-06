import type { PaginationInfo } from '../types/company';

interface PaginationProps {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isLoading?: boolean;
}

export function Pagination({
                               pagination,
                               onPageChange,
                               onPageSizeChange,
                               isLoading = false
                           }: PaginationProps) {
    const { currentPage, totalPages, totalCount, pageSize } = pagination;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <div className="pagination__info">
        <span className="pagination__count">
          Total: {totalCount.toLocaleString()} resultados
        </span>

                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="pagination__page-size"
                    disabled={isLoading}
                >
                    <option value={10}>10 por página</option>
                    <option value={25}>25 por página</option>
                    <option value={50}>50 por página</option>
                    <option value={100}>100 por página</option>
                </select>
            </div>

            <nav className="pagination__nav">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className="pagination__button pagination__button--prev"
                >
                    Anterior
                </button>

                <div className="pagination__pages">
                    {getVisiblePages().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                            disabled={page === '...' || isLoading}
                            className={`pagination__page ${
                                page === currentPage ? 'pagination__page--active' : ''
                            } ${page === '...' ? 'pagination__page--dots' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className="pagination__button pagination__button--next"
                >
                    Siguiente
                </button>
            </nav>
        </div>
    );
}