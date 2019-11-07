import React, { useState, useEffect } from "react";
import { Pagination } from 'react-bootstrap';

function CustomPaging(props) {
    const { pageSize = 5, totalRecords = 0, onChangePage } = props;
    const [currentPage, SetCurrentPage] = useState(1);

    useEffect(() => { SetCurrentPage(1); }, [pageSize]);

    var totalPages = Math.ceil(totalRecords / pageSize);
    var startPage, endPage;
    if (totalPages <= 10) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 6) {
            startPage = 1;
            endPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            endPage = totalPages;
        } else {
            startPage = currentPage - 5;
            endPage = currentPage + 4;
        }
    }

    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalRecords - 1);
    var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
    let pager = ({
        totalItems: totalRecords,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    });

    const changePage = (page) => {
        if (page < 1 || page > pager.totalPages) { return; }
        SetCurrentPage(page);
        onChangePage(page);
    }
    return (
        (pager.totalPages === 1) ? null :
            <Pagination>
                <Pagination.First onClick={() => changePage(1)} />
                <Pagination.Prev onClick={() => changePage(pager.currentPage - 1)} />
                {pager.pages.map((page, index) =>
                    <Pagination.Item key={index} onClick={() => changePage(page)} className={pager.currentPage === page ? 'active' : ''}>{page}</Pagination.Item>
                )}
                <Pagination.Next onClick={() => changePage(pager.currentPage + 1)} />
                <Pagination.Last onClick={() => changePage(pager.totalPages)} />
            </Pagination>
    );
}

export default CustomPaging;