import React from "react";
import { PrimaryButton, Title } from"../../components/common/Design";
import { NavLink } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { useRedirectLoggedOutUser } from './../../hooks/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProductOfUser } from "../../redux/features/productSlice";
import { useEffect} from "react";
import { Table } from './../../components/Table';
import {Loader} from "../../components/common/Loader";
import { sellproductsbyuser } from "../../redux/features/biddingSlice";

export const ProductList = () => {
  useRedirectLoggedOutUser("/login");
    const dispatch=useDispatch();
  const {userproducts ,isLoading}=useSelector((state)=>state.product);

  

  
  useEffect(()=>{
    dispatch(getAllProductOfUser());
  },[dispatch]);

    const handleDeleteProduct = async(id)=>{
    await dispatch(deleteProduct(id));
    await dispatch(getAllProductOfUser());
  };

   const handleSellProduct = async(productId)=>{
    await dispatch(sellproductsbyuser({productId:productId}))
    await dispatch(getAllProductOfUser());
  };


  if (isLoading){
    return <Loader />;
  }

  if (userproducts?.length ===0){
    return (
      <div className="flex justify-center items-center  w-auro h-auto">
        <h2 className="text-3xl text-gray-700">No products found!!</h2>
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
          <NavLink to="/add">
            <PrimaryButton className="flex items-center gap-3 px-5 py-2 text-sm rounded-md transition-transform hover:scale-105">
              <AiOutlinePlus size={20} />
              <span>Create Product</span>
            </PrimaryButton>
          </NavLink>
        </div>
        <hr className="my-5" />
        <Table products ={userproducts} handleDeleteProduct={handleDeleteProduct} handleSellProduct ={handleSellProduct}/>
      </section>
    </>
  );
};