import { Body, Caption, Container, Title } from "../../components/common/Design"
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../../components/common/Design";
import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
import { useRedirectLoggedOutUser } from './../../hooks/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from "react-redux";
import {getProduct} from "../../redux/features/productSlice";
import { useEffect} from "react";
import { useParams } from "react-router-dom";
import { DateFormatter } from "../../utils/DateFormatter";
import { fetchBiddingHistory, placebid } from "../../redux/features/biddingSlice";
import { toast } from "react-toastify";
import {Loader} from"../../components/common/Loader"

export const ProductDetails = () => {

    useRedirectLoggedOutUser("/login");
    const dispatch=useDispatch();
    const {id}=useParams();
    const {product,isLoading}=useSelector((state)=>state.product);
    const {history}=useSelector((state)=>state.bidding);
    const [rate, setRate] = useState(0);
    const [activeTab, setActiveTab] = useState("description");
   
  useEffect(()=>{
    dispatch(getProduct(id));
  },[dispatch,id]);

  useEffect(()=>{
    if (history && history.length>0){
      const highestBid =Math.max(...history.map((bid)=>bid.price))
      setRate(highestBid)
    }else if (product){
      setRate(product.price);
    }
  },[history,product]);

   useEffect(()=>{
    if (product && !product.isSoldout){
    dispatch(fetchBiddingHistory(id));
    }
  },[dispatch,id,product]);

  const incrementBid=()=>{
    setRate((prevRate)=>prevRate+1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const save = async(e) => {
    e.preventDefault();
    if(product.price> rate){
      return toast.error("your bid must be equal to or higher than the product price");
    }
    const formData={
      price:rate,
      productId:id,
    };
    try{
      await dispatch(placebid(formData)).unwrap()
      dispatch(fetchBiddingHistory(id))
    }catch(error){
       return toast.error("An error occurred while placing bid");
    }
  };

  if (isLoading) return <Loader />

  return (
    <>
      <section className="pt-24 px-8">
        <Container>
          <div className="flex justify-between gap-8">
            <div className="w-1/2">
              <div className="h-[70vh]">
                <img src={product?.image?.filePath} alt="" className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
            <div className="w-1/2">
              <Title level={2} className="capitalize">
                {product?.title}
              </Title>
              <div className="flex gap-5">
                <div className="flex text-green ">
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStar size={20} />
                  <IoIosStarHalf size={20} />
                  <IoIosStarOutline size={20} />
                </div>
                <Caption>(2 customer reviews)</Caption>
              </div>
              <br />
              <Body>{product?.description}</Body>
              <br />
              <Caption>Item condition: New</Caption>
              <br />
              <Caption>Item Verifed:{product?.isVerify?"Yes":"No"} </Caption>
              <br />
              <Caption>Time left:</Caption>
              <br />
              <div className="flex gap-8 text-center">
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>149</Title>
                  <Caption>Days</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>12</Title>
                  <Caption>Hours</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>36</Title>
                  <Caption>Minutes</Caption>
                </div>
                <div className="p-5 px-10 shadow-s1">
                  <Title level={4}>51</Title>
                  <Caption>Seconds</Caption>
                </div>
              </div>
              <br />
              <Title className="flex items-center gap-2">
                Auction ends:
                <Caption><DateFormatter date ={product?.createdAt}/></Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Timezone: <Caption>UTC 0</Caption>
              </Title>
              <Title className="flex items-center gap-2 my-5">
                Price:<Caption>${product?.price} </Caption>
              </Title>
              <Title className="flex items-center gap-2">
                Current bid:<Caption className="text-3xl">${rate}</Caption>
              </Title>
              <div className="p-5 px-10 shadow-s3 py-8">
                <form  onSubmit={save} className="flex gap-3 justify-between">
                  <input className={commonClassNameOfInput} type="number" name="price" value={rate} onChange={e=> setRate(e.target.value)}
                   min={product?.price}/>
                  <button type="button" onClick={incrementBid} className="bg-gray-100 rounded-md px-5 py-3">
                    <AiOutlinePlus />
                  </button>
                  <button type="submit"
                   className={`py-3 px-8 rounded-lg ${product?.isSoldout||!product?.isVerify? "bg-gray-400 text-gray-700 cursor-not-allowed":"bg-green text-white"}`}
                  disabled={product?.isSoldout||!product?.isVerify}>
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="details mt-8">
            <div className="flex items-center gap-5">
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "description" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("description")}>
                Description
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "auctionHistory" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("auctionHistory")}>
                Auction History
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "reviews" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("reviews")}>
                Reviews(2)
              </button>
              <button className={`rounded-md px-10 py-4 text-black shadow-s3 ${activeTab === "moreProducts" ? "bg-green text-white" : "bg-white"}`} onClick={() => handleTabClick("moreProducts")}>
                More Products
              </button>
            </div>

            <div className="tab-content mt-8">
              {activeTab === "description" && (
                <div className="description-tab shadow-s3 p-8 rounded-md">
                  <Title level={4}>Description</Title>
                  <br />
                  <Caption className="leading-7">
                   {product?.description}
                  </Caption>
                  <br />
                  <Title level={4}>Product Overview</Title>
                  <div className="flex justify-between gap-5">
                    <div className="mt-4 capitalize w-1/2">
                      <div className="flex justify-between border-b py-3">
                        <Title>category</Title>
                        <Caption>{product?.category}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>height</Title>
                        <Caption> {product?.height ? `${product.height} (cm)` : 'Not available'}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>length</Title>
                        <Caption> {product?.length ? `${product.length} (cm)` : 'Not available'}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>width</Title>
                        <Caption> {product?.width ? `${product.width} (cm)` : 'Not available'}</Caption>
                      </div>
                      <div className="flex justify-between border-b py-3">
                        <Title>weigth</Title>
                        <Caption> {product?.weigth ? `${product.weigth} (Kg)` : 'Not available'}</Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>medium used</Title>
                        <Caption> {product?.mediumused ? `${product.mediumused} ` : 'Not available'} </Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Price</Title>
                        <Caption> {product?.price ? `${product.price}` : 'Not available'}</Caption>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Sold out </Title>
                        {product?.isSoldout ? <Caption>Sold out </Caption>:<Caption>On stock </Caption>}
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>verify</Title>
                        {product?.isVerify ? <Caption>Yes </Caption>:<Caption>No </Caption>}
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <Title>Create At</Title>
                        <Caption><DateFormatter date ={product?.createdAt}/></Caption>
                      </div>
                      <div className="flex justify-between py-3">
                        <Title>Update At</Title>
                        <Caption><DateFormatter date ={product?.updatedAt}/></Caption>
                      </div>
                    </div>
                    <div className="w-1/2">
                      <div className="h-[60vh] p-2 bg-green rounded-xl">
                        <img src={product?.image?.filePath} alt="" className="w-full h-full object-cover rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "auctionHistory" && <AuctionHistory history={history}/>}
              {activeTab === "reviews" && (
                <div className="reviews-tab shadow-s3 p-8 rounded-md">
                  <Title level={5} className=" font-normal">
                    Reviews
                  </Title>
                  <hr className="my-5" />
                  <Title level={5} className=" font-normal text-red-500">
                    Cooming Soon!
                  </Title>
                </div>
              )}
              {activeTab === "moreProducts" && (
                <div className="more-products-tab shadow-s3 p-8 rounded-md">
                  <h1>More Products</h1>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
export const AuctionHistory = ({history}) => {
  return (
    <>
      <div className="shadow-s1 p-8 rounded-lg">
        <Title level={5} className=" font-normal">
          Auction History
        </Title>
        <hr className="my-5" />
           {history?.length === 0 ? (
            <h2 className="m-2">No bidding record found!!</h2>
           ):
           
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Bid Amount(USD)
                </th>
                <th scope="col" className="px-6 py-3">
                  User
                </th>
                <th scope="col" className="px-6 py-3">
                  Auto
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item,index)=>(
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4"><DateFormatter date ={item?.createdAt}/></td>
                <td className="px-6 py-4">{item?.price}</td>
                <td className="px-6 py-4">{item?.user?.name}</td>
                <td className="px-6 py-4"> </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
         }
      </div>
    </>
  );
};