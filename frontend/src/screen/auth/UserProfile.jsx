import React, { useEffect } from "react";
import { Caption, Title } from "../../components/common/Design";
import { User2 } from "../../components/hero/Hero";
import { commonClassNameOfInput, PrimaryButton } from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getuserProfile,updateUser } from "../../redux/features/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";

const initialState ={
  name:"",
  email:"",
  password:"",
  confirmPassword:"", 
};

export const UserProfile = () => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getuserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(formData));
      toast.success("Profile updated successfully!");
      dispatch(getuserProfile());
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-5 mt-10">
            <div className="w-full">
              <Caption className="mb-2">Full Name </Caption>
              <input name ="name" type="search"     value={formData.name}  onChange={handleInputChange}  className={`capitalize ${commonClassNameOfInput}`} placeholder="Sunil"  />
            </div>
          </div>
          <div className="flex items-center gap-5 mt-10">
            <div className="w-full">
              <Caption className="mb-2">Email</Caption>
              <input  name="email" type="search"   value={formData.email} onChange={handleInputChange}  className={commonClassNameOfInput} placeholder="example@gmail.com" />
            </div>
          </div>
          <div className="my-8">
            <Caption className="mb-2">Role</Caption>
            <input type="search" value ={user?.role} onChange={handleInputChange}  className={commonClassNameOfInput} placeholder="admin" required />
          </div>
          
          <PrimaryButton  type="submit">Update Profile</PrimaryButton>  
        </form>
      </section>
    </>
  );
};