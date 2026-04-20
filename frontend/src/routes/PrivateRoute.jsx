import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const adminRoles = ["admin", "superAdmin"];

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token, user } = useSelector((state) => state.auth);
  const isAuthenticated = Boolean(token);
  const role = user?.role;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    const redirectPath = adminRoles.includes(role) ? "/admin/manage-rooms" : "/rooms";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PrivateRoute;
