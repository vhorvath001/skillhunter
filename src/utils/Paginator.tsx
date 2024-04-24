import { ReactElement } from 'react';
import Pagination from 'react-bootstrap/Pagination';

type PropsType = {
    list: any[],
    maxItemsPerPage: number,
    maxPage: number, 
    currentPage:number, 
    setShowedList:  (showedList: any[]) => void, 
    setCurrentPage: (currentPage: number) => void
}

const Paginator = ({ list, maxItemsPerPage, maxPage, currentPage, setShowedList, setCurrentPage }: PropsType): ReactElement => {

    const handlePaginationClick = (page: number) => {
        setCurrentPage(page);
        setShowedList(list.slice( (page-1) * maxItemsPerPage, (page) * maxItemsPerPage ));
    }

    return (
        <Pagination className='float-end'>
            {maxPage > 1 &&
            <Pagination.First 
                onClick={() => handlePaginationClick(1)}
                active={maxPage === 1} 
                data-testid='t-paginator-first' />}

            {currentPage !== 1 &&
                <Pagination.Prev 
                    onClick={() => handlePaginationClick(currentPage-1)}
                    data-testid='t-paginator-prev' />}
                
            {currentPage !== 1 &&
                <Pagination.Item 
                    onClick={() => handlePaginationClick(1)}
                    data-testid='t-paginator-1'>
                    {1}
                </Pagination.Item>}

            {currentPage > 3 &&
            <Pagination.Ellipsis data-testid='t-paginator-ellipsis-front' />}

            {currentPage > 2 &&
                <Pagination.Item 
                    onClick={() => handlePaginationClick(currentPage-1)}
                    data-testid='t-paginator-cp-minus-1' >
                    {currentPage-1}
                </Pagination.Item>}

            {maxPage > 1 && 
            <Pagination.Item 
                onClick={() => handlePaginationClick(currentPage)}
                active={true}
                data-testid='t-paginator-cp'>
                {currentPage}
            </Pagination.Item>}

            {currentPage+1 < maxPage &&
                <Pagination.Item 
                    onClick={() => handlePaginationClick(currentPage+1)}
                    data-testid='t-paginator-cp-plus-1'>
                    {currentPage+1}
                </Pagination.Item>}

            {maxPage - currentPage > 2 &&
            <Pagination.Ellipsis data-testid='t-paginator-ellipsis-back'/>}

            {currentPage != maxPage &&
            <Pagination.Item 
                onClick={() => handlePaginationClick(maxPage)}
                data-testid='t-paginator-maxpage'>
                {maxPage}
            </Pagination.Item>}

            {currentPage < maxPage &&
                <Pagination.Next 
                    onClick={() => handlePaginationClick(currentPage+1)} 
                    data-testid='t-paginator-next' />}

            {maxPage > 1 &&
            <Pagination.Last 
                onClick={() => handlePaginationClick(maxPage)}
                data-testid='t-paginator-last'/>}
        </Pagination>
    )
}

export default Paginator;