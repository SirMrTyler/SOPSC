import TestDelete from "components/tests/TestDelete";
import TestUpdate from "components/tests/TestUpdate";
import { lazy } from "react";
const Landing = lazy(() => import("../components/landing/Landing"));
const Login = lazy(() => import("../components/user/Login"));
const Logout = lazy(() => import("../components/user/Logout"));
const Register = lazy(() => import("../components/user/Register"));
const Confirm = lazy(() => import("../components/user/Confirm"));
const PageNotFound = lazy(() => import("../components/error/Error404"));
const CheckoutSuccess = lazy(() =>
  import("../components/checkout/CheckoutSuccess")
);
const CheckoutBtn = lazy(() => import("../components/checkout/CheckoutBtn"));
const Tests = lazy(() => import("../components/tests/Tests"));

const StripeCreateAcctBtn = lazy(() =>
  import("../components/paymentacct/StripeCreateAcctBtn")
);
const StripeCreateAcctSuccess = lazy(() =>
  import("../components/paymentacct/StripeCreateAcctSuccess")
);
const StripeAcctDashboard = lazy(() =>
  import("../components/dashboard/stripeaccount/StripeAcctDashboard")
);
const AboutUs = lazy(() => import("components/aboutus/AboutUs"));

const routes = [
  {
    path: "/",
    name: "Landing",
    exact: true,
    element: Landing,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/login",
    name: "Login",
    exact: true,
    element: Login,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/register",
    name: "Register",
    exact: true,
    element: Register,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/logout",
    name: "Logout",
    exact: true,
    element: Logout,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/confirm",
    name: "Confirm",
    exact: true,
    element: Confirm,
    roles: [],
    isAnonymous: true,
  },
];

const testsRoutes = [
  {
    path: "/tests",
    name: "Tests",
    exact: true,
    element: Tests,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/tests/update",
    name: "TestUpdate",
    exact: false,
    element: TestUpdate,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/tests/delete",
    name: "TestDelete",
    exact: false,
    element: TestDelete,
    roles: [],
    isAnonymous: true,
  }
]

const stripeRoutes = [
  {
    path: "/checkoutsuccess",
    name: "CheckoutSuccess",
    exact: true,
    element: CheckoutSuccess,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/checkoutbtn",
    name: "CheckoutBtn",
    exact: true,
    element: CheckoutBtn,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stripecreateacctbtn",
    name: "StripeCreateAcctBtn",
    exact: true,
    element: StripeCreateAcctBtn,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stripecreateacctsuccess",
    name: "StripeCreateAcctSuccess",
    exact: true,
    element: StripeCreateAcctSuccess,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stripe/dashboard",
    name: "StripeAcctDashboard",
    exact: true,
    element: StripeAcctDashboard,
    roles: [],
    isAnonymous: true,
  },
];

const errorRoutes = [
  {
    path: "*",
    name: "Error - 404",
    element: PageNotFound,
    roles: [],
    exact: true,
    isAnonymous: true,
  },
];

const aboutUsRoutes = [
  {
    path: "/aboutus",
    name: "AboutUs",
    exact: true,
    element: AboutUs,
    roles: [],
    isAnonymous: true,
  },
];
var allRoutes = [...routes, ...errorRoutes, ...stripeRoutes, ...testsRoutes, ...aboutUsRoutes];

export default allRoutes;
