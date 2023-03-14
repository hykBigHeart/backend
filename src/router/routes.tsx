import { RouteObject } from "react-router-dom";
import {
  Login,
  HomePage,
  Dashboard,
  ErrorPage,
  CoursePage,
  CourseCreatePage,
  CourseUpdatePage,
  TestPage,
  MemberPage,
  MemberCreatePage,
  MemberUpdatePage,
  MemberImportPage,
  SystemAdministratorPage,
  AdministratorCreatePage,
  AdministratorUpdatePage,
  SystemAdminrolesPage,
  DepartmentPage,
  ChangePasswordPage,
  ResourceImagesPage,
  ResourceCategoryPage,
  ResourceVideosPage,
  SystemIndexPage,
} from "../pages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
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
        path: "/course/create",
        element: <CourseCreatePage />,
      },
      {
        path: "/course/update/:cid",
        element: <CourseUpdatePage />,
      },

      {
        path: "/member",
        element: <MemberPage />,
      },
      {
        path: "/member/create",
        element: <MemberCreatePage />,
      },
      {
        path: "/member/update/:memberId",
        element: <MemberUpdatePage />,
      },
      {
        path: "/member/import",
        element: <MemberImportPage />,
      },
      {
        path: "/system/index",
        element: <SystemIndexPage />,
      },
      {
        path: "/system/administrator",
        element: <SystemAdministratorPage />,
      },
      {
        path: "/system/administrator/create",
        element: <AdministratorCreatePage />,
      },
      {
        path: "/system/administrator/update/:userId",
        element: <AdministratorUpdatePage />,
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
    element: <Login />,
  },
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default routes;
