import { lazy } from "react";
import { RouteObject } from "react-router-dom";

import InitPage from "../pages/init";

const LoginPage = lazy(() => import("../pages/login"));
const HomePage = lazy(() => import("../pages/home"));
const DashboardPage = lazy(() => import("../pages/dashboard"));
const ErrorPage = lazy(() => import("../pages/error"));
const CoursePage = lazy(() => import("../pages/course"));
const TestPage = lazy(() => import("../pages/test"));
const MemberPage = lazy(() => import("../pages/member"));
const MemberImportPage = lazy(() => import("../pages/member/import"));
const SystemAdministratorPage = lazy(
  () => import("../pages/system/administrator")
);
const SystemAdminrolesPage = lazy(() => import("../pages/system/adminroles"));
const DepartmentPage = lazy(() => import("../pages/department"));
const ChangePasswordPage = lazy(() => import("../pages/change-password"));
const ResourceImagesPage = lazy(() => import("../pages/resource/images"));
const ResourceCategoryPage = lazy(
  () => import("../pages/resource/resource-category")
);
const ResourceVideosPage = lazy(() => import("../pages/resource/videos"));
const SystemConfigPage = lazy(() => import("../pages/system/config"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <InitPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/change-password",
            element: <ChangePasswordPage />,
          },
          {
            path: "/resource-category",
            element: <ResourceCategoryPage />,
          },
          {
            path: "/images",
            element: <ResourceImagesPage />,
          },
          {
            path: "/videos",
            element: <ResourceVideosPage />,
          },
          {
            path: "/course",
            element: <CoursePage />,
          },
          {
            path: "/member",
            element: <MemberPage />,
          },
          {
            path: "/member/import",
            element: <MemberImportPage />,
          },
          {
            path: "/system/config/index",
            element: <SystemConfigPage />,
          },
          {
            path: "/system/administrator",
            element: <SystemAdministratorPage />,
          },
          {
            path: "/system/adminroles",
            element: <SystemAdminrolesPage />,
          },
          {
            path: "/department",
            element: <DepartmentPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/test",
        element: <TestPage />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
];

export default routes;
