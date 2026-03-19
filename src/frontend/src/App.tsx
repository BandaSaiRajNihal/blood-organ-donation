import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useActor } from "./hooks/useActor";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Donors from "./pages/Donors";
import Home from "./pages/Home";
import Locations from "./pages/Locations";
import RegisterDonor from "./pages/RegisterDonor";

function RootLayout() {
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    actor.seedData().catch(() => {
      /* silent */
    });
  }, [actor]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: Auth,
});
const registerDonorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register-donor",
  component: RegisterDonor,
});
const locationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/locations",
  component: Locations,
});
const donorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/donors",
  component: Donors,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  authRoute,
  registerDonorRoute,
  locationsRoute,
  donorsRoute,
  dashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
