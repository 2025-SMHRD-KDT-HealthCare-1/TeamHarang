import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { user, accessToken } = useAuthStore();
  const [alertShown, setAlertShown] = useState(false);

  const isLoggedIn = user && accessToken;

  useEffect(() => {
    if (!isLoggedIn && !alertShown) {
      alert("로그인이 필요합니다.");
      setAlertShown(true);   //  알람은 한번만
    }
  }, [isLoggedIn, alertShown]);

  if (!isLoggedIn) {
    return null;  // children 렌더링 막기 (보호)
  }

  return children;
};

export default PrivateRoute;
