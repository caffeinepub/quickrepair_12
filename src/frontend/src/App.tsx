import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import MechanicRegisterPage from "./pages/MechanicRegisterPage";
import ThankYouPage from "./pages/ThankYouPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
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

const routeTree = rootRoute.addChildren([
  homeRoute,
  bookRoute,
  mechanicRoute,
  thankYouRoute,
  historyRoute,
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
