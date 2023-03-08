import { RouteObject } from "react-router-dom";
import {
  Login,
  HomePage,
  Dashboard,
  ErrorPage,
  VodListPage,
  TestPage,
  MemberPage,
  MemberCreatePage,
  MemberUpdatePage,
  MemberImportPage,
  SystemAdministratorPage,
  AdministratorCreatePage,
  AdministratorUpdatePage,
  SystemAdminrolesPage,
  AdminrolesCreatePage,
  AdminrolesUpdatePage,
  DepartmentPage,
  DepartmentCreatePage,
  DepartmentUpdatePage,
  ChangePasswordPage,
  ResourceImagesPage,
  ResourceCategoryPage,
  ResourceCategoryCreatePage,
  ResourceCategoryUpdatePage,
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
        path: "/resource-category/create",
        element: <ResourceCategoryCreatePage />,
      },
      {
        path: "/resource-category/update/:catId",
        element: <ResourceCategoryUpdatePage />,
      },
      {
        path: "/images",
        element: <ResourceImagesPage />,
      },
      {
        path: "/vod",
        element: <VodListPage />,
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
        path: "/system/adminroles/create",
        element: <AdminrolesCreatePage />,
      },
      {
        path: "/system/adminroles/update/:roleId",
        element: <AdminrolesUpdatePage />,
      },
      {
        path: "/department",
        element: <DepartmentPage />,
      },
      {
        path: "/department/create",
        element: <DepartmentCreatePage />,
      },
      {
        path: "/department/update/:depId",
        element: <DepartmentUpdatePage />,
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
