import PropTypes from 'prop-types';

function Pagination({pageInfo, handlePageChange}){
  return (
    <div className="d-flex justify-content-center mt-3">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${pageInfo.has_pre? '' : 'disabled'}`}>
            <a className="page-link" onClick={() => handlePageChange(pageInfo.current_page - 1)}>
              上一頁
            </a>
          </li>
          {Array.from({length: pageInfo.total_pages}).map((item, index) => (
            <li className={`page-item ${(pageInfo.current_page === index + 1) ? 'active' : ''}`} key={index}>
              <a className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </a>
            </li>
          ))}
          <li className={`page-item ${pageInfo.has_next? '' : 'disabled'}`}>
            <a className="page-link" onClick={() => handlePageChange(pageInfo.current_page + 1)}>
              下一頁
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

Pagination.propTypes = {
  pageInfo: PropTypes.object,
  handlePageChange: PropTypes.func,
}

export default Pagination;