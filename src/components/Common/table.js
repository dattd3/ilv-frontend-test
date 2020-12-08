class TableUtil {
    updateData (data, pageNumber, recordPerPage) {
      return Array.from(data).slice(
        pageNumber * recordPerPage,
        pageNumber * recordPerPage + recordPerPage
      )
    }
  
    displayPageNumber (pageNumber, pageCount) {
      if (pageNumber > pageCount -1) {
        return pageCount - 1
      } else {
        return pageNumber
      }
    }
  }
  
  const tableUtil = new TableUtil()
  export default tableUtil