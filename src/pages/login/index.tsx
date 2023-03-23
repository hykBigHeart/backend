import React, { useState, useEffect } from "react";
import styles from "./index.module.less";
import { Spin, Input, Button, message } from "antd";
import { login, system } from "../../api/index";
import { setToken } from "../../utils/index";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import banner from "../../assets/images/login/banner.png";
import icon from "../../assets/images/login/icon.png";
import "./login.less";
import { loginAction } from "../../store/user/loginUserSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaVal, setCaptchaVal] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState(true);

  const fetchImageCaptcha = () => {
    setCaptchaLoading(true);
    system.getImageCaptcha().then((res: any) => {
      setImage(res.data.image);
      setCaptchaKey(res.data.key);
      setCaptchaLoading(false);
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
    if (!captchaVal) {
      message.error("请输入图形验证码");
      return;
    }
    if (loading) {
      return;
    }
    handleSubmit();
  };

  const handleSubmit = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    login
      .login(email, password, captchaKey, captchaVal)
      .then((res: any) => {
        const token = res.data.token;
        setToken(token);
        getUser();
      })
      .catch((e) => {
        setLoading(false);
        setCaptchaVal("");
        fetchImageCaptcha();
      });
  };

  const getUser = () => {
    login.getUser().then((res: any) => {
      const data = res.data;
      dispatch(loginAction(data));
      setLoading(false);
      navigate("/");
    });
  };

  const keyUp = (e: any) => {
    if (e.keyCode === 13) {
      loginSubmit(e);
    }
  };

  useEffect(() => {
    fetchImageCaptcha();
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
          <div className="login-box d-flex mt-50">
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ width: 400, height: 54 }}
              placeholder="请输入管理员邮箱账号"
              onKeyUp={(e) => keyUp(e)}
            />
          </div>
          <div className="login-box d-flex mt-50">
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
              value={captchaVal}
              style={{ width: 260, height: 54 }}
              placeholder="请输入图形验证码"
              onChange={(e) => {
                setCaptchaVal(e.target.value);
              }}
              onKeyUp={(e) => keyUp(e)}
            />
            <div className={styles["captcha-box"]}>
              {captchaLoading && (
                <div className={styles["catpcha-loading-box"]}>
                  <Spin size="small" />
                </div>
              )}

              {!captchaLoading && (
                <img
                  className={styles["captcha"]}
                  onClick={fetchImageCaptcha}
                  src={image}
                />
              )}
            </div>
          </div>
          <div className="login-box d-flex mt-50">
            <Button
              style={{ width: 400, height: 54 }}
              type="primary"
              onClick={loginSubmit}
              loading={loading}
            >
              立即登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
