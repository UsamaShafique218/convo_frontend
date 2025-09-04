// src/components/DashboardNavbar.jsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon, 
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useMaterialTailwindController } from "@/context";

import UserImg from "../../../public/img/bruce-mars.jpeg";
import PersonIcon from "../../../public/img/person.svg";
import PowerIcon from "../../../public/img/power.svg";

import $ from "jquery";
import { useEffect } from "react";

export function DashboardNavbar() {
  const [controller] = useMaterialTailwindController();
  const { fixedNavbar } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const navigate = useNavigate(); // <-- React Router navigate hook

  // Logout function
  const handleLogout = (e) => {
    e.preventDefault(); 
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // console.log(localStorage);
    navigate("/login");
  };

  useEffect(() => {
    // Navbar icon toggle
    $(".navbar_icon").on("click", function () {
      $("body").toggleClass("toggle_navbar");
    });

    // User icon dropdown toggle
    $(".user_icon").on("click", function (e) {
      e.preventDefault();
      $(".user_dropdown_menu").toggleClass("hidden block");
      $(this).toggleClass("isDropdownMenuOpen");
    });

    // Close dropdown when clicking outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".user_icon_main").length) {
        $(".user_dropdown_menu").removeClass("block").addClass("hidden");
        $(".user_icon").removeClass("isDropdownMenuOpen");
      }
    });

    // Cleanup event bindings on unmount
    return () => {
      $(".navbar_icon").off("click");
      $(".user_icon").off("click");
      $(document).off("click");
    };
  }, []);

  return (
    <div className="navbar_main">
      <div className="navbar_main_inner">
        {/* Brand + toggle */}
        <div className="brand_name_main">
          <Link to="/" className="brand_name">
            <h4>Convo</h4>
          </Link>

          <IconButton
            variant="text"
            color="blue-gray"
            className="grid navbar_icon"
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
        </div>

        {/* User icons */}
        <div className="flex items-center pt-4 pb-4 user_icon_main">
          <Link to="#" className="user_icon">
            <IconButton variant="text" color="blue-gray" className="grid">
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </Link>

          {/* Dropdown */}
          <ul className="user_dropdown_menu hidden bg-white shadow-md rounded-md w-52 absolute right-0 mt-2 z-50">
            <li>
              <a className="dropdown-item flex items-center p-2" href="#">
                <div className="avatar avatar-online w-10 h-10 mr-2">
                  <img
                    src={UserImg}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h6 className="mb-0 text-sm font-semibold">Raheel</h6>
                  <small className="text-gray-500">Admin</small>
                </div>
              </a>
            </li>

            <li>
              <Link
                to="/profile"
                className="dropdown-item flex items-center p-2 hover:bg-gray-100 rounded-md"
              >
                <img src={PersonIcon} alt="Profile" className="w-5 h-5 mr-2" />
                <small>My Profile</small>
              </Link>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="dropdown-item flex items-center p-2 hover:bg-gray-100 rounded-md w-full"
              >
                <img src={PowerIcon} alt="Logout" className="w-5 h-5 mr-2" />
                <small>Log Out</small>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardNavbar;
