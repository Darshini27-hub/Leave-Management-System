import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import TeamRequests from "./pages/TeamRequests";
import AdminLeaves from "./pages/AdminLeaves";
import ManageUsers from "./pages/ManageUsers";
import UserForm from "./pages/UserForm";
import LeaveTypes from "./pages/LeaveTypes";
import Holidays from "./pages/Holidays";
import Profile from "./pages/Profile";
import NotFound from "./pages/Notfound";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* all pages inside this route have the sidebar layout and need login */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* employee and manager */}
            <Route path="/leaves/apply" element={<ProtectedRoute roles={["employee", "manager"]}><ApplyLeave /></ProtectedRoute>} />
            <Route path="/leaves/my" element={<ProtectedRoute roles={["employee", "manager"]}><MyLeaves /></ProtectedRoute>} />

            {/* manager */}
            <Route path="/leaves/team" element={<ProtectedRoute roles={["manager"]}><TeamRequests /></ProtectedRoute>} />

            {/* admin */}
            <Route path="/admin/leaves" element={<ProtectedRoute roles={["admin"]}><AdminLeaves /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><ManageUsers /></ProtectedRoute>} />
            <Route path="/admin/users/new" element={<ProtectedRoute roles={["admin"]}><UserForm /></ProtectedRoute>} />
            <Route path="/admin/users/:id" element={<ProtectedRoute roles={["admin"]}><UserForm /></ProtectedRoute>} />
            <Route path="/admin/leave-types" element={<ProtectedRoute roles={["admin"]}><LeaveTypes /></ProtectedRoute>} />
            <Route path="/admin/holidays" element={<ProtectedRoute roles={["admin"]}><Holidays /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
