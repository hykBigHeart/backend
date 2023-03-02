import React from "react";
import { RouteObject } from "react-router-dom";
import { Login, HomePage, Dashboard } from "../pages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default routes;
