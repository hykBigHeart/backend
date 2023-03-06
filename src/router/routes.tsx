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
  MemberUpdatePage
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
