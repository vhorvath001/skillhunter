import Pagination from 'react-bootstrap/Pagination';

const Paginator = ( { list, maxItemsPerPage, maxPage, currentPage, setShowedList, setCurrentPage } ) => {
    const handlePaginationClick = (page) => {
        setCurrentPage(page);
        setShowedList(list.slice( (page-1) * maxItemsPerPage, (page) * maxItemsPerPage ));
    }

    return (
        <Pagination className='float-end'>
            {maxPage > 1 &&
            <Pagination.First 
                onClick={() => handlePaginationClick(1)}
                active={maxPage === 1} />}

            {currentPage !== 1 &&
                <Pagination.Prev onClick={() => handlePaginationClick(currentPage-1)} />}
                
            {currentPage !== 1 &&
            <Pagination.Item onClick={() => handlePaginationClick(1)}>{1}</Pagination.Item>}

            {currentPage > 3 &&
            <Pagination.Ellipsis />}

            {currentPage > 2 &&
                <Pagination.Item 
                    onClick={() => handlePaginationClick(currentPage-1)}>
                    {currentPage-1}
                </Pagination.Item>}

            {maxPage > 1 && 
            <Pagination.Item 
                onClick={() => handlePaginationClick(currentPage)}
                active='true'>
                {currentPage}
            </Pagination.Item>}

            {currentPage+1 < maxPage &&
                <Pagination.Item onClick={() => handlePaginationClick(currentPage+1)}>
                    {currentPage+1}
                </Pagination.Item>}

            {maxPage - currentPage > 2 &&
            <Pagination.Ellipsis />}

            {currentPage != maxPage &&
            <Pagination.Item onClick={() => handlePaginationClick(maxPage)}>{maxPage}</Pagination.Item>}

            {currentPage < maxPage &&
                <Pagination.Next onClick={() => handlePaginationClick(currentPage+1)} />}

            {maxPage > 1 &&
            <Pagination.Last onClick={() => handlePaginationClick(maxPage)}/>}
        </Pagination>
    )
}

export default Paginator;