import { Title } from "../../components/common/Design";
import { Table } from "../../components/Table";
import { useRedirectLoggedOutUser } from './../../hooks/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct} from "../../redux/features/productSlice";
import { useEffect} from "react";
import {Loader} from "../../components/common/Loader";
     
export const AdminProductList = () => {

    useRedirectLoggedOutUser("/login");
    const dispatch=useDispatch();
  const {products,isLoading}=useSelector((state)=>state.product);

  useEffect(()=>{
    dispatch(getAllProduct());
  },[dispatch]);

  if (isLoading){
      return <Loader />;
    }
  
    if (products?.length ===0){
      return (
        <div className="flex justify-center items-center w-auro h-auto bg-gray-100">
          <h2 className="text-x1 text-gray-700">No products found!!</h2>
        </div>
      );
    }

  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="flex justify-between">
          <Title level={5} className=" font-normal">
            Product Lists
          </Title>
        </div>
        <hr className="my-5" />
        <Table  products ={products} isAdmin={true}/>
      </section>
    </>
  );
};