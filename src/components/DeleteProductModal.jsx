import axios from 'axios';
import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap';
import PropTypes from 'prop-types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function DeleteProductModal({
  getProductList,
  tempProduct,
  isOpen,
  setIsOpen
}){

  const deleteProductModalRef = useRef(null);

  // 使用useEffect在畫面渲染後才能取得DOM
  useEffect(() => {
    new Modal(deleteProductModalRef.current);
  }, [])

  useEffect(() => {
    if(isOpen){
      const modalInstance = Modal.getInstance(deleteProductModalRef.current)
      modalInstance.show();
    }
  }, [isOpen])

  const handleDeleteProduct = async() => {
    try {
      await deleteProduct();
      getProductList();
      handleCloseDeleteProductModal();
    } catch (error) {
      alert('刪除產品失敗')
    }
  }

  const handleCloseDeleteProductModal = () => {
    const modalInstance = Modal.getInstance(deleteProductModalRef.current)
    modalInstance.hide();

    setIsOpen(false);
  }

  useEffect(() => {
    const modalElement = deleteProductModalRef.current;
    const handleModalHidden = () => setIsOpen(false);

    if (modalElement) {
      modalElement.addEventListener("hidden.bs.modal", handleModalHidden);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("hidden.bs.modal", handleModalHidden);
      }
    };
  }, [setIsOpen])

  const deleteProduct = async() => {
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`)
    } catch (error) {
      alert('刪除產品失敗')
    }
  }

  return(
    <>
      <div
      ref={deleteProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                onClick={handleCloseDeleteProductModal}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除 
              <span className="text-danger fw-bold">{tempProduct.title}</span>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCloseDeleteProductModal}
                type="button"
                className="btn btn-secondary"
              >
                取消
              </button>
              <button onClick={handleDeleteProduct} type="button" className="btn btn-danger">
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

DeleteProductModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  getProductList: PropTypes.func,
  tempProduct: PropTypes.object
}

export default DeleteProductModal;