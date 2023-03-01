import axios from "axios";

axios.defaults.timeout = 10000;
axios.defaults.headers.Authorization = "Bearer ";
axios.defaults.headers.common["meedu-platform"] = "backend";
axios.defaults.baseURL = "https://dev-local.meedu.vip/";

// 响应拦截器
axios.interceptors.response.use(
  (res) => res.data, // 拦截到响应对象，将响应对象的 data 属性返回给调用的地方
  (err) => Promise.reject(err)
);
