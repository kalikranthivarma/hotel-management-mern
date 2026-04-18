import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  if (!user) return <div className="loader-container">Loading profile...</div>;

  const isAdmin = user.role === "admin" || user.role === "superAdmin";

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-text">
            <p className="eyebrow">✦ {isAdmin ? "Admin Console" : "Guest Portal"}</p>
            <h1 className="welcome-text">
              Welcome Back, <span className="name">{user.firstName}</span>
            </h1>
          </div>
          <div className="header-actions">
            {!isAdmin && (
              <Link to="/rooms" className="dash-btn dash-btn--primary">
                Explore Rooms
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin/bookings" className="dash-btn dash-btn--primary">
                View All Bookings
              </Link>
            )}
          </div>
        </header>

        {isAdmin ? (
          /* Admin View */
          <div className="admin-grid">
            <section className="dashboard-section main-stats">
              <h2 className="section-title">System Overview</h2>
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-label">Total Rooms</span>
                  <span className="stat-value">24</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Active Bookings</span>
                  <span className="stat-value">12</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Revenue (Month)</span>
                  <span className="stat-value bronze">₹1,42,000</span>
                </div>
              </div>
            </section>

            <section className="dashboard-section quick-actions">
              <h2 className="section-title">Management Actions</h2>
              <div className="actions-grid">
                <Link to="/admin/manage-rooms" className="action-card">
                  <span className="icon">🛏</span>
                  <div className="text">
                    <h3>Manage Rooms</h3>
                    <p>Add, edit or deactivate property listings.</p>
                  </div>
                </Link>

                <Link to="/admin/bookings" className="action-card">
                  <span className="icon">📅</span>
                  <div className="text">
                    <h3>Booking Requests</h3>
                    <p>Approve or cancel reservation requests.</p>
                  </div>
                </Link>
                <div className="action-card disabled">
                  <span className="icon">👥</span>
                  <div className="text">
                    <h3>Guest List</h3>
                    <p>View and manage registered members.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* Guest View */
          <div className="guest-grid">
            <section className="dashboard-section profile-info">
              <h2 className="section-title">Profile Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">FULL NAME</span>
                  <span className="value">{user.firstName} {user.lastName}</span>
                </div>
                <div className="info-item">
                  <span className="label">EMAIL ADDRESS</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">PHONE NUMBER</span>
                  <span className="value">{user.phone || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <span className="label">ACCOUNT STATUS</span>
                  <span className="value status-active">Active Member</span>
                </div>
              </div>
            </section>

            <section className="dashboard-section quick-links">
              <h2 className="section-title">Quick Links</h2>
              <div className="links-row">
                <Link to="/bookings" className="link-card">
                  <span className="icon">🕒</span>
                  <h3>My Stay History</h3>
                </Link>
                <Link to="/rooms" className="link-card">
                  <span className="icon">🏨</span>
                  <h3>Book a New Stay</h3>
                </Link>
                <div className="link-card">
                  <span className="icon">💎</span>
                  <h3>Member Rewards</h3>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;