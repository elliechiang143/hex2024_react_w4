import { useState } from 'react'
import Login from './pages/Login';
import ProductList from './pages/ProductList';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  
  
  // const getProductList = async(page=1) => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/${API_PATH}/admin/products?page=${page}`);
  //     setProducts(res.data.products);
  //     setPageInfo(res.data.pagination);
  //     console.log(res.data.pagination)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <>
    {isAuth ? <ProductList setIsAuth={setIsAuth}/> : 
    <Login setIsAuth={setIsAuth}/>
    }
    </>
  )
}

export default App
