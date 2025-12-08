import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { user, accessToken } = useAuthStore();
  const [alertShown, setAlertShown] = useState(false);

  const isLoggedIn = user && accessToken;

  useEffect(() => {
    if (!isLoggedIn && !alertShown) {
      alert("로그아웃 되었습니다");
      setAlertShown(true);
    }
  }, [isLoggedIn, alertShown]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;   // ✔ Hook 순서 보존 + 리다이렉트 방식
  }

  return children;
};

export default PrivateRoute;
