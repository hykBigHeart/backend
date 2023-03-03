import ReactDOM from "react-dom/client";
import "./index.less";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";

const basename = process.env.REACT_BASE_NAME || "";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <ConfigProvider
      locale={zhCN}
      theme={{ token: { colorPrimary: "#ff4d4f" } }}
    >
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
