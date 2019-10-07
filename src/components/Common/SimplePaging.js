import React, { useState, useEffect } from "react";
import { Pagination } from 'react-bootstrap';

function SimplePaging(props) {
    const { pageSize, totalRecords } = props;
    const [ _pageSize, SetPageSize] = useState(5);
    const [ _totalRecords, SetTotalRecords] = useState(0);
    const [pager, SetPager] = useState({});

    useEffect(() => {
        SetPageSize(pageSize);
        SetTotalRecords(totalRecords);
    }, [pageSize, totalRecords]);

    function setPage(page) {
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }
        pager = getPager(totalRecords, page, pageSize);
        SetPager(pager);
        this.props.onChangePage(page);
    }

    function getPager(totalItems, currentPage, pageSize) {
        currentPage = currentPage || 1;
        pageSize = pageSize || 10;
        var totalPages = Math.ceil(totalItems / pageSize);
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
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    return (
        <Pagination>
            <Pagination.First onClick={() => this.setPage(1)} />
            <Pagination.Prev onClick={() => this.setPage(pager.currentPage - 1)} />
            {pager.pages.map((page, index) =>
                <Pagination.Item key={index} onClick={() => this.setPage(page)} className={pager.currentPage === page ? 'active' : ''}>{page}</Pagination.Item>
            )}
            <Pagination.Next onClick={() => this.setPage(pager.currentPage + 1)} />
            <Pagination.Last onClick={() => this.setPage(pager.totalPages)} />
        </Pagination>
    );
}
export default SimplePaging;