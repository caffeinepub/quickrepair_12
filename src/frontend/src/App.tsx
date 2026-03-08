import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import BackToTop from "./components/layout/BackToTop";
import AdminPage from "./pages/AdminPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import MechanicRegisterPage from "./pages/MechanicRegisterPage";
import ThankYouPage from "./pages/ThankYouPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <BackToTop />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookingPage,
});

const mechanicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mechanic-register",
  component: MechanicRegisterPage,
});

const thankYouRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/thankyou",
  component: ThankYouPage,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: BookingHistoryPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  bookRoute,
  mechanicRoute,
  thankYouRoute,
  historyRoute,
  adminRoute,
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
