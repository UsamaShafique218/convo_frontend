import { Routes, Route } from "react-router-dom";
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";

export function Dashboard() {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <DashboardNavbar />
      <div className="pb-4 dashboard_content flex">
        {/* Sidebar */}
        <Sidenav
          routes={routes}
          brandImg={
            sidenavType === "dark"
              ? "/img/logo-ct.png"
              : "/img/logo-ct-dark.png"
          }
        />

        {/* Main Content */}
        <div className="flex-1 p-4">
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "dashboard" &&
                pages.map(({ path, element, collapse, pages: subPages }) => {
                  if (collapse && subPages) {
                    // render collapsed pages
                    return subPages.map(({ path, element }) => (
                      <Route key={path} path={path} element={element} />
                    ));
                  }
                  return (
                    <Route key={path} path={path} element={element} />
                  );
                })
            )}
          </Routes>

          <div className="text-blue-gray-600">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/Dashboard.jsx";

export default Dashboard;
