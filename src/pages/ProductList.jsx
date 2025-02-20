import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import { Modal } from 'bootstrap';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: false,
  imagesUrl: [""]
};

function ProductList(){

  // 載入時取得產品列表
  useEffect(() => {
    getProductList();
  },[])

  const [pageInfo, setPageInfo] = useState({});
  const [products, setProducts] = useState([]);

  const deleteProductModalRef = useRef(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // 使用useEffect在畫面渲染後才能取得DOM
  useEffect(() => {
    new Modal(deleteProductModalRef.current);
  }, [])

  // 判斷 Modal 為編輯產品還是新增產品
  const [modalMode, setModalMode] = useState(null);

  const handlePageChange = (page) => {
    getProductList(page)
  }

  const getProductList = async(page=1) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPageInfo(res.data.pagination);
    } catch (error) {
      console.log(error)
    }
  }

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);

    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState)
        break;

      case 'edit':
        // 帶入產品資料
        setTempProduct(product)
        break;
        
      default:
        break;
    }

    setIsProductModalOpen(true);
    // console.log(isProductModalOpen)
  }

  // useEffect(() => {
  //   console.log(isProductModalOpen)
  // },[isProductModalOpen])

  const handleOpenDeleteProductModal = (product) => {
    setTempProduct(product);
    const modalInstance = Modal.getInstance(deleteProductModalRef.current)
    modalInstance.show();
  }

  const handleCloseDeleteProductModal = () => {
    const modalInstance = Modal.getInstance(deleteProductModalRef.current)
    modalInstance.hide();
  }

  const [tempProduct, setTempProduct] = useState(defaultModalState);

  const deleteProduct = async() => {
    try {
      await axios.delete(`${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`)
    } catch (error) {
      alert('刪除產品失敗')
    }
  }

  const handleDeleteProduct = async() => {
    try {
      await deleteProduct();
      getProductList();
      handleCloseDeleteProductModal();
    } catch (error) {
      alert('刪除產品失敗')
    }
  }

  return (
    <>
    <div className="container">
      <div className="row">
        <div className="col text-end mt-5">
          <button type="button" className="btn btn-primary" onClick={() => {
            handleOpenProductModal('create')
          }}>建立新的產品</button>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col">
          <h2 className='mb-3'>產品列表</h2>
          <table className="table">
            <thead>
              <tr>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled ? (<span className='text-success'>啟用</span>) : (<span>未啟用</span>)}</td>
                  <td>
                    <div className="btn-group">
                      <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => {
                        handleOpenProductModal('edit', product)
                      }}>編輯</button>
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=> handleOpenDeleteProductModal(product)}>刪除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} getProductList={getProductList}/>
      </div>
    </div>

    <ProductModal
      modalMode={modalMode} 
      tempProduct={tempProduct} 
      getProductList={getProductList}
      isOpen={isProductModalOpen}
      setIsOpen={setIsProductModalOpen}
    />

    {/* 刪除 Modal */}
    <div
      ref={deleteProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
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

export default ProductList;