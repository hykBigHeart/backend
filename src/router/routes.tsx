import React from "react";
import { RouteObject } from "react-router-dom";
import { Login, HomePage, Dashboard, ErrorPage, VodListPage } from "../pages";

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
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default routes;
