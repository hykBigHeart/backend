import axios from "axios";

export const getCategoriesAsync = (params: any) =>
  axios.get("/categroy/findCategroy", {
    params: params,
  });

export const addCategoriesAsync = (data: any) =>
  axios.post("/categroy/addCategroy", data);
