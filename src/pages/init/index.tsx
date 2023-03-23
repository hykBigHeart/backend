import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { loginAction } from "../../store/user/loginUserSlice";

interface Props {
  loginData: any | null;
}

const InitPage = (props: Props) => {
  const dispatch = useDispatch();
  if (props.loginData) {
    dispatch(loginAction(props.loginData));
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default InitPage;
