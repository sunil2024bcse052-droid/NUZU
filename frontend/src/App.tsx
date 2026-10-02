import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Discover from "./pages/Discover";
import CreateActivity from "./pages/CreateActivity";
import ActivityDetail from "./pages/ActivityDetail";
import ProfilePage from "./pages/ProfilePage";
import Circles from "./pages/Circles";
import AdminDashboard from "./pages/AdminDashboard";
import { getMyProfile } from "./lib/user";

function isLoggedIn() {
  return !!localStorage.getItem("nuzu_token");
}

function RequireAuth({ children }: { children: ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    getMyProfile()
      .then((res) => setStatus(res.user.role === "ADMIN" ? "allowed" : "denied"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "loading") return <p className="text-ink/50">Checking access...</p>;
  if (status === "denied") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<Discover />} />
          <Route path="activities/:id" element={<ActivityDetail />} />
          <Route path="circles" element={<Circles />} />
          <Route path="create" element={<CreateActivity />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}