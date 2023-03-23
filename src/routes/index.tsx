import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { login } from "../api";

import InitPage from "../pages/init";
import { getToken } from "../utils";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import DashboardPage from "../pages/dashboard";
import ChangePasswordPage from "../pages/change-password";
import ResourceCategoryPage from "../pages/resource/resource-category";
import ResourceImagesPage from "../pages/resource/images";
import ResourceVideosPage from "../pages/resource/videos";
import CoursePage from "../pages/course";
import MemberPage from "../pages/member";
import MemberImportPage from "../pages/member/import";
import SystemConfigPage from "../pages/system/config";
import SystemAdministratorPage from "../pages/system/administrator";
import SystemAdminrolesPage from "../pages/system/adminroles";
import DepartmentPage from "../pages/department";
import TestPage from "../pages/test";
import ErrorPage from "../pages/error";

// 异步加载页面
// const LoginPage = lazy(() => import("../pages/login"));
// const HomePage = lazy(() => import("../pages/home"));
// const DashboardPage = lazy(() => import("../pages/dashboard"));
// const ErrorPage = lazy(() => import("../pages/error"));
// const CoursePage = lazy(() => import("../pages/course"));
// const TestPage = lazy(() => import("../pages/test"));
// const MemberPage = lazy(() => import("../pages/member"));
// const MemberImportPage = lazy(() => import("../pages/member/import"));
// const SystemAdministratorPage = lazy(
//   () => import("../pages/system/administrator")
// );
// const SystemAdminrolesPage = lazy(() => import("../pages/system/adminroles"));
// const DepartmentPage = lazy(() => import("../pages/department"));
// const ChangePasswordPage = lazy(() => import("../pages/change-password"));
// const ResourceImagesPage = lazy(() => import("../pages/resource/images"));
// const ResourceCategoryPage = lazy(
//   () => import("../pages/resource/resource-category")
// );
// const ResourceVideosPage = lazy(() => import("../pages/resource/videos"));
// const SystemConfigPage = lazy(() => import("../pages/system/config"));

let RootPage: any = null;
if (getToken()) {
  RootPage = lazy(async () => {
    return new Promise<any>((resolve) => {
      let userLoginToken = getToken();
      if (!userLoginToken) {
        resolve({
          default: InitPage,
        });
        return;
      }
      login.getUser().then((res: any) => {
        resolve({
          default: <InitPage loginData={res.data} />,
        });
      });
      // todo token过期处理
    });
  });
} else {
  RootPage = <InitPage loginData={null} />;
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: RootPage,
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
