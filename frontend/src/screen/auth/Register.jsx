import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Caption, Container, CustomNavLink, PrimaryButton, Title } from "../../components/common/Design";
import { commonClassNameOfInput } from "../../components/common/Design";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register, RESET } from "../../redux/features/authSlice";


const initialState ={
  name:"",
  email:"",
  password:"",
  confirmPassword:"", 
};

export const Register = () => {
   const[userImage,setUserImage]=useState("");
  const[imagePreview,setImagePreview]=useState(null);

  const handleimagechange =(e)=>{
    setUserImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };


  const dispatch =useDispatch();
  const navigate =useNavigate();
  const[formData,setFormData]=useState(initialState);
  const{name,email,password,confirmPassword}=formData;
  const{isLoading,isSuccess,isLoggedIn,message,isError} =useSelector ((state)=>state.auth);

  const handleInputChange =(e)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
  };

  const handleRegister=(e)=>{
    e.preventDefault();

    if (!name ||!email ||!password ||!confirmPassword){
      return toast.error("All fields are required") ;
    }

    if (password.length<8){
      return toast.error("password must be at least 8 characters");
    }

     if (password !==confirmPassword){
      return toast.error("password does not match");
    }

  const userData = { name, email, password };

    dispatch (register(userData));
  };

  useEffect(()=>{
    if (isSuccess && isLoggedIn){
      navigate("/login");
    }
    if (isError){
      toast.error(message||"Registration failed")
    }

    return ()=>{
      dispatch(RESET());
    };
  },
   [dispatch,isLoggedIn ,isSuccess,isError,message,navigate]
);


  return (
    <>
    {isLoading && <loader/>}
      <section className="regsiter pt-16 relative">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Sign Up
              </Title>
              <div className="flex items-center gap-3">
                <Title level={5} className="text-green font-normal text-xl">
                  Home
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  /
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  Sign Up
                </Title>
              </div>
            </div>
          </Container>
        </div>
        <form onSubmit ={handleRegister} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Sign Up</Title>
            <p className="mt-2 text-lg">
              Do you already have an account? <CustomNavLink href="/login">Log In Here</CustomNavLink>
            </p>
          </div>
          <div className="py-5">
            <Caption className="mb-2">Username *</Caption>
            <input type="text" name="name" value ={name} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="First Name" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Enter Your Email *</Caption>
            <input type="email" name="email"value ={email}  onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Enter Your Email" required />
          </div>
          <div>
            <Caption className="mb-2">Password *</Caption>
            <input type="password" name="password" value ={password}  onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Enter Your Password" required />
          </div>
          <div>
            <Caption className="mb-2 block">Confirm Password *</Caption>
            <input type="password" name="confirmPassword" value ={confirmPassword}  onChange={handleInputChange}className={commonClassNameOfInput} placeholder="Confirm password" />
          </div>
          
                    {/* <div>
                      <Caption className="mb-2">Image </Caption>
                      <input type="file" className={`${commonClassNameOfInput}`} name="image" onChange={(e)=>handleimagechange(e)}/>
                      {imagePreview!==null?(
                        <div>
                          <img src={imagePreview} alt ="" className="mt-5 rounded-lg w-48 h-48 object-cover" />
                          </div>
                      ):(
                        <p></p>
                      )}
                    </div> */}
          <div className="flex items-center gap-2 py-4">
            <input type="checkbox" />
            <Caption>I agree to the Terms & Policy</Caption>
          </div>
          <PrimaryButton type="submit" className="w-full rounded-none my-5">CREATE ACCOUNT</PrimaryButton>
          <div className="text-center border py-4 rounded-lg mt-4">
            <Title>OR SIGNUP WITH</Title>
            <div className="flex items-center justify-center gap-5 mt-5">
              <button className="flex items-center gap-2 bg-red-500 text-white p-3 px-5 rounded-sm">
                <FaGoogle />
                <p className="text-sm">SIGNUP WHIT GOOGLE</p>
              </button>
              <button className="flex items-center gap-2 bg-indigo-500 text-white p-3 px-5 rounded-sm">
                <FaFacebook />
                <p className="text-sm">SIGNUP WHIT FACEBOOK</p>
              </button>
            </div>
          </div>
          <p className="text-center mt-5">
            By clicking the signup button, you create a Cobiro account, and you agree to Cobiros <span className="text-green underline">Terms & Conditions</span> &
            <span className="text-green underline"> Privacy Policy </span> .
          </p>
        </form>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};