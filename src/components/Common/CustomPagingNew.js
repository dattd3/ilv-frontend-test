import React from "react";
import { useTranslation } from "react-i18next";
import { Image } from "react-bootstrap";
import arrow_left from "assets/img/ic-left-arrow.svg";
import arrow_right from "assets/img/ic-right-arrow.svg";

function CustomPaging(props) {
  const { t } = useTranslation();
  const {
    onChangePageSize,
    onChangePageIndex,
    totalRecords,
    pageSize,
    pageIndex,
  } = props;

  const totalPages = Math.ceil(totalRecords / pageSize);
  let pager = {
    totalItems: totalRecords,
    currentPage: totalPages === 1 ? 1 : pageIndex,
    pageSize: pageSize,
    totalPages: totalPages,
  };

  const changePage = (page) => {
    if (page < 1 || page > pager.totalPages) {
      return;
    }
    onChangePageIndex(page);
  };
  
  return (
    <div className="d-flex justify-content-between pagination-new">
      <div className="align-self-center">
        <span className="mr-2">{t('EvaluationShow')}</span>
        <select
          onChange={(e) => {
            const size = parseInt(e.target.value);
            onChangePageSize(size);
          }}
        >
          <option>5</option>
          <option>10</option>
          <option>20</option>
        </select>
      </div>
      <div className="align-self-center pages">
        {pager.totalPages == null || pager.totalPages === 0 ? null : (
          <div>
            <span
              className="icon"
              disabled={pager.currentPage === 1}
              onClick={() => changePage(1)}
            >
              <Image
                src={arrow_left}
                alt="Previous"
                className="application-image"
              ></Image>
              {/* <Image
                src={arrow_left}
                alt="Previous"
                className="application-image"
              ></Image> */}
            </span>

            {pager.currentPage === totalPages && totalPages - 2 > 0 && (
              <span onClick={() => changePage(pager.currentPage - 2)}>
                {pager.currentPage - 2}
              </span>
            )}
            {pager.currentPage > 1 && (
              <span onClick={() => changePage(pager.currentPage - 1)}>
                {pager.currentPage - 1}
              </span>
            )}
            <span
              className="active"
              onClick={() => changePage(pager.currentPage)}
            >
              {pager.currentPage}
            </span>
            {pager.currentPage < totalPages && (
              <span onClick={() => changePage(pager.currentPage + 1)}>
                {pager.currentPage + 1}
              </span>
            )}
            {pager.currentPage === 1 && totalPages > 2 && (
              <span onClick={() => changePage(pager.currentPage + 2)}>
                {pager.currentPage + 2}
              </span>
            )}
            <span
              className="icon"
              disabled={pager.currentPage === pager.totalPages}
              onClick={() => changePage(pager.totalPages)}
            >
              <Image
                src={arrow_right}
                alt="Next"
                className="application-image"
              ></Image>
              {/* <Image
                src={arrow_right}
                alt="Next"
                className="application-image"
              ></Image> */}
            </span>
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}
export default CustomPaging;
