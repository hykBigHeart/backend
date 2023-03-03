import React, { useState, useEffect } from "react";
import styles from "./index.module.less";
import { Spin, Input, Button, message } from "antd";
import { login, system } from "../../api/index";
import { setToken } from "../../utils/index";
import { useDispatch } from "react-redux";
import {
  IsLoginActionCreator,
  SetUserActionCreator,
  SetPermisssionsActionCreator,
} from "../../store/user/userActions";
import { useNavigate } from "react-router-dom";
import banner from "../../assets/images/login/banner.png";
import icon from "../../assets/images/login/icon.png";

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captcha_val, setCaptcha_val] = useState<string>("");
  const [captcha_key, setCaptcha_key] = useState<string>("");
  const fetchData = () => {
    setLoading(true);
    system.getImageCaptcha().then((res: any) => {
      setImage(res.data.image);
      setCaptcha_key(res.data.key);
      setLoading(false);
    });
  };

  const loginSubmit = (e: any) => {
    if (!email) {
      message.error("请输入管理员邮箱账号");
      return;
    }
    if (!password) {
      message.error("请输入密码");
      return;
    }
    if (!captcha_val) {
      message.error("请输入图形验证码");
      return;
    }
    if (loading) {
      return;
    }
    handleSubmit();
  };

  const handleSubmit = () => {
    setLoading(true);
    login
      .login(email, password, captcha_key, captcha_val)
      .then((res: any) => {
        const token = res.data.token;
        setToken(token);
        setLoading(false);
        getUser();
      })
      .catch((e) => {
        setLoading(false);
        setCaptcha_val("");
        fetchData();
      });
  };

  const getUser = () => {
    login.getUser().then((res: any) => {
      const data = res.data;
      dispatch(IsLoginActionCreator());
      dispatch(SetUserActionCreator(data.user));
      dispatch(SetPermisssionsActionCreator(data.permissions));
      navigate("/");
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles["login-content"]}>
      <div className={styles["banner-box"]}>
        <img className={styles["banner"]} src={banner} alt="" />
      </div>
      <div className={styles["login-box"]}>
        <div className={styles["left-box"]}>
          <img className={styles["icon"]} src={icon} alt="" />
        </div>
        <div className={styles["right-box"]}>
          <div className={styles["title"]}>后台登录</div>
          <div className="d-flex mt-50">
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ width: 400, height: 54 }}
              placeholder="请输入管理员邮箱账号"
            />
          </div>
          <div className="d-flex mt-50">
            <Input.Password
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{ width: 400, height: 54 }}
              placeholder="请输入密码"
            />
          </div>
          <div className="d-flex mt-50">
            <Input
              value={captcha_val}
              style={{ width: 260, height: 54 }}
              placeholder="请输入图形验证码"
              onChange={(e) => {
                setCaptcha_val(e.target.value);
              }}
            />
            <img
              className={styles["captcha"]}
              onClick={fetchData}
              src={image}
              alt=""
            />
          </div>
          <div className="d-flex mt-50">
            <Button
              style={{ width: 400, height: 54 }}
              type="primary"
              danger
              onClick={loginSubmit}
            >
              立即登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
