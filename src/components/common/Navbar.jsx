import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom';
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { BsChevronDown } from "react-icons/bs";
import { ACCOUNT_TYPE } from "../../utils/constants";

export const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();

    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false); // Mobile menu state
    const [showMobileCatalog, setShowMobileCatalog] = useState(false); // For mobile catalog dropdown

    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const res = await apiConnector("GET", categories.CATEGORIES_API)
                setSubLinks(res.data.data)
            } catch (error) {
                console.log("Could not fetch Categories.", error)
            }
            setLoading(false)
        })()
    }, [])

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }

    const handleNavLinkClick = () => {
        setShowMobileMenu(false); // Hide mobile menu on link click
    }

    return (
        <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""
            } transition-all duration-200`}>
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>

                {/* Desktop Navigation links */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <>
                                        <div
                                            className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                                                ? "text-yellow-25"
                                                : "text-richblack-25"
                                                }`}
                                        >
                                            <p>{link.title}</p>
                                            <BsChevronDown />
                                            {/* Catalog dropdown */}
                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[200px]">
                                                <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                {loading ? (
                                                    <p className="text-center">Loading...</p>
                                                ) : subLinks.length ? (
                                                    <>
                                                        {subLinks
                                                            ?.filter(
                                                                (subLink) => subLink?.courses?.length > 0
                                                            )
                                                            ?.map((subLink, i) => (
                                                                <Link
                                                                    to={`/catalog/${subLink.name
                                                                        .split(" ")
                                                                        .join("-")
                                                                        .toLowerCase()}`}
                                                                    className="rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50"
                                                                    key={i}
                                                                >
                                                                    <p>{subLink.name}</p>
                                                                </Link>
                                                            ))}
                                                    </>
                                                ) : (
                                                    <p className="text-center">No Courses Found</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link to={link?.path}>
                                        <p
                                            className={`${matchRoute(link?.path)
                                                ? "text-yellow-25"
                                                : "text-richblack-25"
                                                }`}
                                        >
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Login / Signup / Dashboard */}
                <div className="hidden items-center gap-x-4 md:flex">
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                            {totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {token === null && (
                        <>
                            <Link to="/login">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                                    Sign up
                                </button>
                            </Link>
                        </>
                    )}
                    {token !== null && <ProfileDropDown />}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mr-4 md:hidden"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    {showMobileMenu ? (
                        <AiOutlineClose fontSize={24} fill="#AFB2BF" />
                    ) : (
                        <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
                    )}
                </button>

                {/* Mobile Dropdown Menu */}
                {showMobileMenu && (
                    <div className="absolute top-14 right-0 z-50 w-[250px] bg-richblack-900 text-richblack-100 rounded-lg shadow-lg">
                        <ul className="flex flex-col items-start p-4">
                            {NavbarLinks.map((link, index) => (
                                <li key={index} className="w-full">
                                    {link.title === "Catalog" ? (
                                        <>
                                            <div
                                                className="flex items-center justify-between w-full cursor-pointer"
                                                onClick={() => setShowMobileCatalog(!showMobileCatalog)}
                                            >
                                                <p>{link.title}</p>
                                                <BsChevronDown />
                                            </div>
                                            {/* Mobile Catalog Dropdown */}
                                            {showMobileCatalog && (
                                                <div className="flex flex-col pl-4">
                                                    {loading ? (
                                                        <p className="text-center">Loading...</p>
                                                    ) : subLinks.length ? (
                                                        <>
                                                            {subLinks
                                                                ?.filter(
                                                                    (subLink) => subLink?.courses?.length > 0
                                                                )
                                                                ?.map((subLink, i) => (
                                                                    <Link
                                                                        to={`/catalog/${subLink.name
                                                                            .split(" ")
                                                                            .join("-")
                                                                            .toLowerCase()}`}
                                                                        className="py-2 pl-2 hover:bg-richblack-700 w-full"
                                                                        key={i}
                                                                        onClick={handleNavLinkClick} // Hide menu on link click
                                                                    >
                                                                        <p>{subLink.name}</p>
                                                                    </Link>
                                                                ))}
                                                        </>
                                                    ) : (
                                                        <p className="text-center">No Courses Found</p>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link to={link?.path} className="block w-full py-2" onClick={handleNavLinkClick}>
                                            <p>{link.title}</p>
                                        </Link>
                                    )}
                                </li>
                            ))}
                            {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                                <li className="mt-4">
                                    <Link to="/dashboard/cart" className="flex items-center gap-2" onClick={handleNavLinkClick}>
                                        <AiOutlineShoppingCart className="text-xl" />
                                        <span className="text-sm">
                                            Cart ({totalItems})
                                        </span>
                                    </Link>
                                </li>
                            )}
                            {token !== null && (
                                <li className="mt-4">
                                    <ProfileDropDown />
                                </li>
                            )}
                            {token === null && (
                                <>
                                    <li className="mt-4">
                                        <Link to="/login">
                                            <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100" onClick={handleNavLinkClick}>
                                                Log in
                                            </button>
                                        </Link>
                                    </li>
                                    <li className="mt-2">
                                        <Link to="/signup">
                                            <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100" onClick={handleNavLinkClick}>
                                                Sign up
                                            </button>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
