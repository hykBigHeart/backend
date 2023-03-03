import { RouteObject } from "react-router-dom";
import {
  Login,
  HomePage,
  Dashboard,
  ErrorPage,
  VodListPage,
  TestPage,
  MemberPage,
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
