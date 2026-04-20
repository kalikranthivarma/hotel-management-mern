import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import AdminRegister from "./pages/AdminRegister";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResendVerification from "./pages/ResendVerification";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import BookingHistory from "./pages/BookingHistory";
import AdminBookings from "./pages/AdminBookings";
import ManageRooms from "./pages/ManageRooms";
import Dining from "./pages/Dining";
import AdminDiningOrders from "./pages/AdminDiningOrders";
import AdminMenuManagement from "./pages/AdminMenuManagement";
import AdminReservations from "./pages/AdminReservations";
import PrivateRoute from "./routes/PrivateRoute";

const adminRoles = ["admin", "superAdmin"];

const RoomsEntryRoute = () => {
  const role = useSelector((state) => state.auth.user?.role);

  if (adminRoles.includes(role)) {
    return <Navigate to="/admin/manage-rooms" replace />;
  }

  return <Rooms />;
};

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-luxe-ivory font-sans text-luxe-charcoal selection:bg-luxe-bronze selection:text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/admin/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/user/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
          <Route path="/rooms" element={<RoomsEntryRoute />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route
            path="/bookings"
            element={
              <PrivateRoute allowedRoles={["guest", "admin", "superAdmin"]}>
                <BookingHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <PrivateRoute allowedRoles={adminRoles}>
                <AdminBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-rooms"
            element={
              <PrivateRoute allowedRoles={adminRoles}>
                <ManageRooms />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dining-orders"
            element={
              <PrivateRoute allowedRoles={adminRoles}>
                <AdminDiningOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <PrivateRoute allowedRoles={adminRoles}>
                <AdminMenuManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <PrivateRoute allowedRoles={adminRoles}>
                <AdminReservations />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
