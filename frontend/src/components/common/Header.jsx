import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import {
  Container,
  CustomNavLink,
  CustomNavLinkList,
  ProfileCard,
} from "./Design";
import { User1 } from "../hero/Hero";
import { menulists } from "../../utils/data";
import { ShowOnLogin, ShowOnLogout } from "../../utils/HiddenLink";
import { useDispatch, useSelector } from "react-redux";
import { UseUserprofile } from "../../hooks/useUserProfile";
import {
  getuserProfile,
  selectIsLoggedIn,
} from "../../redux/features/authSlice";

export const Header = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const { role } = UseUserprofile();

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenuOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getuserProfile());
    }
  }, [dispatch, isLoggedIn]);

  const isHomePage = location.pathname === "/";

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  return (
    <>
      <header
        className={`header ${
          isHomePage ? "bg-primary" : "bg-white shadow-s1"
        } ${isScrolled ? "scrolled" : ""} py-1`}
      >
        <Container>
          <nav className="p-4 flex justify-between items-center relative">
            {/* Logo and Menu List */}
            <div className="flex items-center gap-14">
              <img
                src="../images/comman/header-logo.png"
                alt="LogoImg"
                className="h-11"
              />
              <ul className="hidden lg:flex items-center gap-8">
                {menulists.map((list) => (
                  <li key={list.id} className="capitalize list-none">
                    <CustomNavLinkList
                      href={list.path}
                      isActive={location.pathname === list.path}
                      className={`${
                        isScrolled || !isHomePage
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      {list.link}
                    </CustomNavLinkList>
                  </li>
                ))}
              </ul>
            </div>

            {/* Search and Auth Links */}
            <div className="flex items-center gap-8 icons relative">
              {/* Search icon */}
              <IoSearchOutline
  size={23}
  onClick={() => {
    navigate(searchTerm.trim() ? `/products?search=${searchTerm}` : "/products");
    setShowSearch(false);
    setSearchTerm("");
  }}
  className={`cursor-pointer ${
    isScrolled || !isHomePage ? "text-black" : "text-white"
  }`}
/>

              {/* Search input */}
              {showSearch && (
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search products..."
                  autoFocus
                  className="absolute top-full mt-2 right-10 w-80 px-4 py-2 rounded-full border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 bg-white text-black z-50"
                />
              )}

              {/* Desktop Auth Links */}
              <div className="hidden lg:flex items-center gap-8">
                {isLoggedIn && role === "buyer" && (
                  <ShowOnLogin>
                    <CustomNavLink
                      href="/seller/login"
                      className={`${
                        isScrolled || !isHomePage
                          ? "text-black"
                          : "text-white"
                      }`}
                    >
                      Become a Seller
                    </CustomNavLink>
                  </ShowOnLogin>
                )}
                <ShowOnLogout>
                  <CustomNavLink
                    href="/login"
                    className={`${
                      isScrolled || !isHomePage ? "text-black" : "text-white"
                    }`}
                  >
                    Sign in
                  </CustomNavLink>
                  <CustomNavLink
                    href="/register"
                    className={`${
                      !isHomePage || isScrolled ? "bg-green" : "bg-white"
                    } px-8 py-2 rounded-full text-primary shadow-md`}
                  >
                    Join
                  </CustomNavLink>
                </ShowOnLogout>

                <ShowOnLogin>
                  <CustomNavLink href="/dashboard">
                    <ProfileCard>
                      <img
                        src={User1}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    </ProfileCard>
                  </CustomNavLink>
                </ShowOnLogin>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMenu}
                className={`lg:hidden w-10 h-10 flex justify-center items-center ${
                  isScrolled || !isHomePage
                    ? "bg-primary text-white"
                    : "bg-black text-white"
                }`}
              >
                {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              </button>
            </div>

            {/* Mobile Menu */}
            <div
              ref={menuRef}
              className={`lg:hidden w-full absolute top-full right-0 p-5 bg-primary text-white shadow-md z-40 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <ul className="flex flex-col gap-4">
                {menulists.map((list) => (
                  <li key={list.id} className="uppercase list-none">
                    <CustomNavLink href={list.path}>{list.link}</CustomNavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
};
