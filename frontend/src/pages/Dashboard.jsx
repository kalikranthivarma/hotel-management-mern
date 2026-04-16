import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-card">
        <p className="register-eyebrow">Dashboard</p>
        <h1>
          Hello, {user?.firstName} {user?.lastName}
        </h1>
        <p className="dashboard-copy">
          Your guest account is now connected to the real login flow.
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-panel">
            <span>Email</span>
            <strong>{user?.email || "-"}</strong>
          </div>

          <div className="dashboard-panel">
            <span>Phone</span>
            <strong>{user?.phone || "-"}</strong>
          </div>

          <div className="dashboard-panel">
            <span>Loyalty points</span>
            <strong>{user?.loyaltyPoints ?? 0}</strong>
          </div>
        </div>

        <button type="button" className="register-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
