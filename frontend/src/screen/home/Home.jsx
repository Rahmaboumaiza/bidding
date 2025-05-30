import { CategorySlider, Hero ,Process,TopCollection,TopSeller,Trust} from "../../routes";
import { ProductList } from "../../components/hero/ProductList";
import { useRedirectLoggedOutUser } from './../../hooks/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct} from "../../redux/features/productSlice";
import { useEffect} from "react";

export const Home =()=>{

    useRedirectLoggedOutUser("/login");
    const dispatch=useDispatch();
  const {products}=useSelector((state)=>state.product);

  useEffect(()=>{
    dispatch(getAllProduct());
  },[dispatch]);

    return (
    <>
       < Hero/>
       < CategorySlider/>
       < ProductList products={products}/>
       < TopSeller/>
       < Process/>
       < Trust/>
       {/* < TopCollection/> */}
    </>
    );
};