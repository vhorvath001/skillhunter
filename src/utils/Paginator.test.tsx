import { render, screen } from '@testing-library/react';
import Paginator from './Paginator';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

test('test Paginator when currentPage=1 and maxPage=1', () => {
    render( <Paginator 
                maxPage={1}
                currentPage={1}
                list={[]}
                maxItemsPerPage={1}
                setShowedList={() => {}}
                setCurrentPage={() => {}} /> );
    expect(screen.queryByTestId('t-paginator-first')).not.toBeInTheDocument();
});

test('test Paginator when currentPage=1 and maxPage=2', () => {
    render( <Paginator 
                maxPage={2}
                currentPage={1}
                list={[]}
                maxItemsPerPage={1}
                setShowedList={() => {}}
                setCurrentPage={() => {}} /> );
    expect(screen.queryByTestId('t-paginator-first')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-prev')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-ellipsis-front')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp-minus-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp-plus-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-ellipsis-back')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-maxpage')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-next')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-last')).toBeInTheDocument();
});

test('test Paginator when currentPage=2 and maxPage=2', () => {
    render( <Paginator 
                maxPage={2}
                currentPage={2}
                list={[]}
                maxItemsPerPage={1}
                setShowedList={() => {}}
                setCurrentPage={() => {}} /> );
    expect(screen.queryByTestId('t-paginator-first')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-prev')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-1')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-ellipsis-front')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp-minus-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp-plus-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-ellipsis-back')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-maxpage')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-next')).not.toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-last')).toBeInTheDocument();
});

test('test Paginator when currentPage=5 and maxPage=20', () => {
    render( <Paginator 
                maxPage={20}
                currentPage={5}
                list={[]}
                maxItemsPerPage={1}
                setShowedList={() => {}}
                setCurrentPage={() => {}} /> );
    expect(screen.queryByTestId('t-paginator-first')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-prev')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-1')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-ellipsis-front')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp-minus-1')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-cp-plus-1')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-ellipsis-back')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-maxpage')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-next')).toBeInTheDocument();
    expect(screen.queryByTestId('t-paginator-last')).toBeInTheDocument();
});

test('test when setCurrentPage & setShowedList are set correctly when onClick is fired', async () => {
    const list: number[] = Array(5*20).fill(-1).map((v,i)=>i);
    let currentPage: number = -1;
    let showedList: number[] = [];
    const setCurrentPageMocked = (page: number) => currentPage = page;
    const setShowedListMocked = (l: number[]) => showedList = l;
   
    render( <Paginator 
                maxPage={20}
                currentPage={5}
                maxItemsPerPage={5}
                list={list}
                setCurrentPage={setCurrentPageMocked}
                setShowedList={setShowedListMocked} /> );
    
    await userEvent.click(screen.queryByTestId('t-paginator-next')!);
   
    expect(currentPage).toEqual(6);
    expect(showedList).toEqual(expect.arrayContaining([25,26,27,28,29]));
});