import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import PrivateRoute from "./routes/PrivateRoute";

const AdminRegister = lazy(() => import("./pages/AdminRegister"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminContactMessages = lazy(() => import("./pages/AdminContactMessages"));
const Register = lazy(() => import("./pages/Register"));
const ResendVerification = lazy(() => import("./pages/ResendVerification"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Rooms = lazy(() => import("./pages/Rooms"));
const RoomDetails = lazy(() => import("./pages/RoomDetails"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));
const AdminBookings = lazy(() => import("./pages/AdminBookings"));
const ManageRooms = lazy(() => import("./pages/ManageRooms"));
const Dining = lazy(() => import("./pages/Dining"));
const AdminDiningOrders = lazy(() => import("./pages/AdminDiningOrders"));
const AdminMenuManagement = lazy(() => import("./pages/AdminMenuManagement"));
const AdminTableManagement = lazy(() => import("./pages/AdminTableManagement"));
const AdminReservations = lazy(() => import("./pages/AdminReservations"));

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
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/resend-verification"
              element={<ResendVerification />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/verify-email/:token" element={<VerifyEmail />} />
            <Route
              path="/admin/verify-email/:token"
              element={<VerifyEmail />}
            />
            <Route
              path="/user/reset-password"
              element={<ResetPassword />}
            />
            <Route
              path="/admin/reset-password"
              element={<ResetPassword />}
            />
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
              path="/admin/tables"
              element={
                <PrivateRoute allowedRoles={adminRoles}>
                  <AdminTableManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/contact-messages"
              element={
                <PrivateRoute allowedRoles={adminRoles}>
                  <AdminContactMessages />
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
        </Suspense>
      </main>
    </BrowserRouter>
  );
}

export default App;
