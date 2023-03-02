import React from "react";
import { RouteObject } from "react-router-dom";
import { Login, HomePage } from "../pages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default routes;
