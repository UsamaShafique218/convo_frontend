import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import {
  Button,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController } from "@/context";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function Sidenav({ routes }) {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const location = useLocation();

  return (
    <aside className="z-50 h-100 duration-300 rounded-none side_navbar">
      <div className="side_nav_links_main pt-2">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col gap-1">
            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}

            {pages.map(({ icon, name, path, collapse, pages: childPages }) => {
              if (collapse) {
                // check if any child path matches current location
                const isOpen = childPages.some((cp) =>
                  location.pathname.includes(cp.path)
                );

                return (
                  <li key={name}>
                    <details className="group" open={isOpen}>
                     <summary
                      className={`flex items-center justify-between text-white gap-2 px-4 py-3 cursor-pointer  side_nav_link ${
                        isOpen ? "bg-[#1d2531] text-[#b7c0cd] font-semibold" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {icon}
                        <Typography className="font-medium capitalize text-white">
                          {name}
                        </Typography>
                      </div>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180 text-white" : "text-gray-500"
                        }`}
                      />
                    </summary>


                      <ul className="ml-6 mt-1 space-y-1">
                        {childPages.map(({ name: childName, path: childPath }) => (
                          <li key={childName}>
                            <NavLink
                              to={`/${layout}${childPath}`}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm  side_nav_link ${
                                  isActive ? "text-indigo-600 font-semibold" : "text-white"
                                }`
                              }
                            >
                              {childName}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              }

              return (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`} className="side_nav_link">
                    {({ isActive }) => (
                      <Button
                        className={`flex items-center gap-4 px-4 capitalize side_nav_btn ${
                          isActive ? "bg-indigo-100 text-indigo-700" : ""
                        }`}
                        fullWidth
                      >
                        {icon}
                        <Typography className="font-medium capitalize">
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
