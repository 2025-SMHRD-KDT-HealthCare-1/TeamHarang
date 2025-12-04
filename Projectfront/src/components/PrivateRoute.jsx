import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PrivateRoute = ({ children }) => {
  const { user, accessToken } = useAuthStore();                // Zustand 저장소(useAuthStore)에 저장된 로그인 정보를 가져오는 것

  const isLoggedIn = user && accessToken;

  if (!isLoggedIn) {
    return <Navigate to="/?needLogin=true" replace />;        // /?needLogin=true  -> 로그인이 필요한 페이지여서 차단됨
  }

  return children;
};

export default PrivateRoute;
