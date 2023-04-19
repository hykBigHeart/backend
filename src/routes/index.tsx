import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { login, system } from "../api";

import InitPage from "../pages/init";
import { getToken } from "../utils";

import LoginPage from "../pages/login";
import HomePage from "../pages/home";
import DashboardPage from "../pages/dashboard";
import ChangePasswordPage from "../pages/change-password";
import ResourceCategoryPage from "../pages/resource/resource-category";
import ResourceImagesPage from "../pages/resource/images";
import ResourceVideosPage from "../pages/resource/videos";
import CoursePage from "../pages/course/index";
import CourseUserPage from "../pages/course/user";
import MemberPage from "../pages/member";
import MemberImportPage from "../pages/member/import";
import MemberLearnPage from "../pages/member/learn";
import SystemConfigPage from "../pages/system/config";
import SystemAdministratorPage from "../pages/system/administrator";
import SystemAdminrolesPage from "../pages/system/adminroles";
import DepartmentPage from "../pages/department";
import TestPage from "../pages/test";
import ErrorPage from "../pages/error";

// const LoginPage = lazy(() => import("../pages/login"));

let RootPage: any = null;
if (getToken()) {
  RootPage = lazy(async () => {
    return new Promise<any>(async (resolve) => {
      try {
        let configRes: any = await system.getSystemConfig();
        let userRes: any = await login.getUser();

        resolve({
          default: (
            <InitPage configData={configRes.data} loginData={userRes.data} />
          ),
        });
      } catch (e) {
        console.error("系统初始化失败", e);
        resolve({
          default: <ErrorPage />,
        });
      }
    });
  });
} else {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
  RootPage = <InitPage />;
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
            path: "/course/user/:courseId",
            element: <CourseUserPage />,
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
            path: "/member/learn",
            element: <MemberLearnPage />,
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
