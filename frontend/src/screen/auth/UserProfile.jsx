import React, { useEffect } from "react";
import { Caption, Title } from "../../components/common/Design";
import { User2 } from "../../components/hero/Hero";
import { commonClassNameOfInput, PrimaryButton } from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getuserProfile,u } from "../../redux/features/authSlice";
import { useState } from "react";

const initialState ={
  name:"",
  email:"",
  password:"",
  confirmPassword:"", 
};

export const UserProfile = () => {
  const[formData,setFormData]=useState(initialState);

    const handleInputChange =(e)=>{
    const {name,value}=e.target;
    setFormData({...formData,[name]:value});
  };

  useRedirectLoggedOutUser("/login");

  const {user}= useSelector ((state)=>state.auth);
  const dispatch=useDispatch();

  useEffect(()=>{
    dispatch(getuserProfile());
  },[dispatch]);

  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="profile flex items-center gap-8">
          <img src={User2} alt="" className="w-24 h-24 rounded-full object-cover" />
          <div>
            <Title level={5} className="capitalize">
             {user?.name}
            </Title> 
            <Caption>{user?.email}</Caption>
          </div>
        </div>
        <form>
          <div className="flex items-center gap-5 mt-10">
            <div className="w-full">
              <Caption className="mb-2">Full Name </Caption>
              <input type="search" value ={user?.name}  onChange={handleInputChange}  className={`capitalize ${commonClassNameOfInput}`} placeholder="Sunil" readOnly />
            </div>
          </div>
          <div className="flex items-center gap-5 mt-10">
            <div className="w-1/2">
              <Caption className="mb-2">Contact Number</Caption>
              <input type="search" className={commonClassNameOfInput} placeholder="Contact Number" />
            </div>
            <div className="w-1/2">
              <Caption className="mb-2">Email</Caption>
              <input type="search" value ={user?.email} onChange={handleInputChange}  className={commonClassNameOfInput} placeholder="example@gmail.com" disabled />
            </div>
          </div>
          <div className="my-8">
            <Caption className="mb-2">Role</Caption>
            <input type="search" value ={user?.role} onChange={handleInputChange}  className={commonClassNameOfInput} placeholder="admin" required />
          </div>
          <div className="my-8">
            <Caption className="mb-2">Profile Picture</Caption>
            <input type="search" className={commonClassNameOfInput} placeholder="Working" required />
          </div>
          <PrimaryButton>Update Profile</PrimaryButton>
        </form>
      </section>
    </>
  );
};