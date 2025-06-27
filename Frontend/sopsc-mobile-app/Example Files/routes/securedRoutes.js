import { lazy } from "react";
const AnalyticsDashboards = lazy(() =>
  import("../components/dashboard/analytics/Analytics")
);
const CourseListView = lazy(() =>
  import("../components/courses/CourseListView")
);
const PageNotFound = lazy(() => import("../components/error/Error404"));
const Forum = lazy(() => import("../components/forums/Forum"));
const ForumForm = lazy(() => import("../components/forums/CreateForum"));

const TestInstances = lazy(() => import("../components/instances/TestAnswers"));
const UploadFile = lazy(() => import("../components/files/UploadFile"));
const businessProfiles = lazy(() => import("../components/businessprofiles/BusinessProfiles"));
const businessProfileDetails = lazy(() => import("../components/businessprofiles/BusinessProfileDetails"));
const Lenders = lazy(() => import("../components/lender/Lenders"));
const LenderInfo = lazy(() => import("../components/lender/lenderInfo"));
const FaqForm = lazy(() => import("../components/faq/FaqForm"));
const FaqsList = lazy(() => import("components/faq/FaqsList"));
const BlogsForm = lazy(() => import("../components/blogs/BlogsForm"))
const BorrowerDebtForm = lazy(() => import("../components/BorrowerDebtForm"));
const LectureForm = lazy(() => import("../components/lecture/LectureForm"));

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboards",
    icon: "uil-home-alt",
    header: "Navigation",
    children: [
      {

        path: "/dashboard/analytics",
        name: "Analytics",
        element: AnalyticsDashboards,
        roles: ["Admin"],
        exact: true,
        isAnonymous: false,
      },
      {
        path: "/borrowerdebt/new",
        name: "BorrowerDebtForm",
        exact: true,
        element: BorrowerDebtForm,
        roles: ["Admin"],
        isAnonymous: false,
      },
    ],
  },
];
const forumRoutes = [
  {
    path: "/forum",
    name: "Forums",
    element: Forum,
    roles: [],
    exact: true,
    isAnonymous: false,
  },
  {
    path: "/create-new-forum",
    name: "New Forum Form",
    element: ForumForm,
    roles: [],
    exact: true,
    isAnonymous: false,
  },
];

const test = [
  {
    path: "/test",
    name: "Test",
    exact: true,
    element: AnalyticsDashboards,
    roles: ["Fail"],
    isAnonymous: false,
  },
  {
    path: "/secured",
    name: "A Secured Route",
    exact: true,
    element: AnalyticsDashboards,
    roles: ["Fail"],
    isAnonymous: false,
  },
  {
    path: "/secured2",
    name: "A Secured Route",
    exact: true,
    element: AnalyticsDashboards,
    roles: ["Admin"],
    isAnonymous: false,
  },
];

const businessProfileRoutes = [
  {
    path: "/profiles/business",
    name: "BusinessProfiles",
    exact: true,
    element: businessProfiles,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/profiles/business/details",
    name: "BusinessProfiles",
    exact: true,
    element: businessProfileDetails,
    roles: ["Admin"],
    isAnonymous: false,
  },
];

const courseRoutes = [
  {
    path: "/courses",
    name: "Courses",
    exact: true,
    element: CourseListView,
    roles: ["Admin"],
    isAnonymous: false,
  },
];

const lenderRoutes = [
  {
    path: "/lenders",
    name: "Lenders",
    exact: true,
    element: Lenders,
    roles: ["Admin"],
    isAnonymous: true,
  },
  {
    path: `/lender/more`,
    name: "Lender info",
    exact: true,
    element: LenderInfo,
    roles: ["Admin"],
    isAnonymous: true,
  },
];

const filesRoutes = [
  {
    path: "/files/upload",
    name: "UploadFile",
    exact: true,
    element: UploadFile,
    roles: ["Admin"],
    isAnonymous: false,
  }
]

const errorRoutes = [
  {
    path: "*",
    name: "Error - 404",
    element: PageNotFound,
    roles: [],
    exact: true,
    isAnonymous: false,
  },
];

const faqRoutes = [
  {
    path: "/faqs",
    name: "Faq",
    exact: true,
    element: FaqsList,
    roles: ["Admin"],
    isAnonymous: true,
  },
  {
    path: "/faqs/new",
    name: "Faq",
    exact: true,
    element: FaqForm,
    roles: ["Admin"],
    isAnonymous: true,
  },
  {
    path: "/faqs/:id",
    name: "Faq",
    exact: true,
    element: FaqForm,
    roles: ["Admin"],
    isAnonymous: true,
  }
];

const lectures = [
  {
    path: "/lectureform",
    name: "LectureForm",
    exact: true,
    element: LectureForm,
    roles: ["Admin"],
    isAnonymous: false,
  },
];

const blogRoutes = [
  {
    path: "/blogs",
    name: "Blogs",
    exact: true,
    roles: ["Admin"],
    element: BlogsForm,
    isAnonymous: false
  },
];

const testInstancesRoutes = [
  {
    path: "/test/instances",
    name: "TestInstances",
    exact: true,
    element: TestInstances,
    roles: ["Admin"],
    isAnonymous: false,
  }
];

const allRoutes = [
  ...dashboardRoutes,
  ...test,
  ...errorRoutes,
  ...faqRoutes,
  ...forumRoutes,
  ...lenderRoutes,
  ...courseRoutes,
  ...blogRoutes,
  ...businessProfileRoutes,
  ...lectures,
  ...testInstancesRoutes,
  ...filesRoutes,
];

export default allRoutes;
