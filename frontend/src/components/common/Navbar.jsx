import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { RxCross2 } from "react-icons/rx"
import { BsChevronDown } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"
import { logout } from "../../services/operations/authAPI"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    ;(async () => {
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

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`relative flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200 z-50`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : (subLinks && subLinks.length) ? (
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
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
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
                      className={`${
                        matchRoute(link?.path)
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
         <Link to="/login">
             <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:scale-105 transition-all duration-300">
              Log in
            </button>
          </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:scale-105 transition-all duration-300">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        {/* Mobile menu toggle button */}
        <button
          className="mr-4 md:hidden text-richblack-100 hover:text-white transition-all duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <RxCross2 fontSize={24} />
          ) : (
            <AiOutlineMenu fontSize={24} />
          )}
        </button>
      </div>

      {/* Mobile Floating Dropdown Menu */}
      <div
        className={`absolute top-[50px] right-[5%] w-[230px] rounded-lg border border-richblack-700 bg-richblack-800 p-4 shadow-2xl z-50 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Navigation links */}
        <nav className="flex flex-col gap-y-1 text-sm text-richblack-25">
          {NavbarLinks.map((link, index) => (
            <div key={index}>
              {link.title === "Catalog" ? (
                <div className="flex flex-col">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsCatalogOpen(!isCatalogOpen)
                    }}
                    className="flex items-center justify-between py-2 text-richblack-25 hover:text-yellow-25 transition-all duration-200 w-full text-left"
                  >
                    <span>{link.title}</span>
                    <BsChevronDown className={`text-xs transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isCatalogOpen && (
                    <div className="flex flex-col pl-4 mt-1 border-l border-richblack-700 gap-y-2 py-1">
                      {loading ? (
                        <p className="text-richblack-400 py-1 text-xs">Loading...</p>
                      ) : (subLinks && subLinks.length) ? (
                        subLinks
                          ?.filter((subLink) => subLink?.courses?.length > 0)
                          ?.map((subLink, i) => (
                            <Link
                              key={i}
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="text-richblack-100 hover:text-yellow-25 transition-all duration-200 py-1 text-xs"
                            >
                              {subLink.name}
                            </Link>
                          ))
                      ) : (
                        <p className="text-richblack-400 py-1 text-xs">No Courses Found</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={link?.path}
                  className={`block py-2 hover:text-yellow-25 transition-all duration-200 ${
                    matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"
                  }`}
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-3 border-t border-richblack-700"></div>

        {/* Action Buttons & Cart */}
        <div className="flex flex-col gap-y-2">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link
              to="/dashboard/cart"
              className="flex items-center gap-x-2 py-2 text-sm text-richblack-100 hover:text-white transition-all duration-200"
            >
              <div className="relative">
                <AiOutlineShoppingCart className="text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-1.5 -right-1.5 grid h-4 w-4 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-[10px] font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </Link>
          )}

          {token === null && (
            <div className="flex flex-col gap-y-2">
              <Link to="/login" className="w-full">
                <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-900 py-[6px] text-center text-xs text-richblack-100 hover:bg-richblack-700 transition-all duration-200">
                  Log in
                </button>
              </Link>
              <Link to="/signup" className="w-full">
                <button className="w-full rounded-[8px] border border-transparent bg-yellow-50 py-[6px] text-center text-xs font-semibold text-richblack-900 hover:bg-yellow-100 transition-all duration-200">
                  Sign up
                </button>
              </Link>
            </div>
          )}

          {token !== null && (
            <div className="flex flex-col gap-y-2">
              <Link
                to="/dashboard/my-profile"
                className="flex items-center gap-x-2 py-1.5 text-sm text-richblack-100 hover:text-white transition-all duration-200"
              >
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => dispatch(logout(navigate))}
                className="w-full text-left py-1.5 text-sm text-pink-200 hover:text-pink-100 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar