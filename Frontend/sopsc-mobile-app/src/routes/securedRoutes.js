import { lazy } from "react";

// Lazy load components
const Landing = lazy(() => import("../components/landing/LandingPage"));
const Login = lazy(() => import("../components/auth/Login"));

// Example admin component
// const Dashboard = lazy(() => import("../components/dashboard/Dashboard"));
const landingRoutes = [
  {
    path: "/landing",
    name: "Landing",
    element: Landing,
    roles: [],
    exact: true,
    isAnonymous: false,
  },
];
// Example secured route for admin dashboard
/*const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    element: Dashboard,
    roles: ["Admin"],
    exact: true,
    isAnonymous: false,
  },
];*/

const allRoutes = [
    ...landingRoutes,
    // ...adminRoutes,
];

export default allRoutes;