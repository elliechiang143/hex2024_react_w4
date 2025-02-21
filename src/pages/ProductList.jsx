import axios from 'axios';
import { useEffect, useState } from 'react'
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DeleteProductModal from '../components/DeleteProductModal';

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

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

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
  }

  const handleOpenDeleteProductModal = (product) => {
    setTempProduct(product);
    
    setIsDelProductModalOpen(true);
  }

  useEffect(() => {
    console.log(isDelProductModalOpen)
  },[isDelProductModalOpen])

  
  const [tempProduct, setTempProduct] = useState(defaultModalState);


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
    <DeleteProductModal
      isOpen={isDelProductModalOpen}
      setIsOpen={setIsDelProductModalOpen}
      getProductList={getProductList}
      tempProduct={tempProduct}
    />
  </>
  )
}

export default ProductList;