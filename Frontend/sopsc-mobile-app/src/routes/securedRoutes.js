import { lazy } from "react";

// Lazy load components
const Landing = lazy(() => import("../components/landing/LandingPage"));
const Login = lazy(() => import("../components/auth/Login"));
const Reports = lazy(() => import("../components/reports/Reports"));
const ReportDetails = lazy(() => import("../components/reports/ReportDetails"));

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

const reportRoutes = [
  {
    path: "/reports",
    name: "Reports",
    element: Reports,
    roles: [],
    exact: true,
    isAnonymous: false,
  },
  {
    path: "/reports/:reportId",
    name: "ReportDetails",
    element: ReportDetails,
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
    ...reportRoutes,
    // ...adminRoutes,
];

export default allRoutes;
