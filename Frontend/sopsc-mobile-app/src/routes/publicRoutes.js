const routes = [
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

var allRoutes = [...routes, /*...otherRoutes*/];

export default allRoutes;