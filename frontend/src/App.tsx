import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Placeholder({ title }: { title: string }) {
  return <h1 className="font-display text-3xl">{title}</h1>;
}

function isLoggedIn() {
  return !!localStorage.getItem("nuzu_token");
}

function RequireAuth({ children }: { children: ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
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
          <Route path="/" element={<Placeholder title="Discover nearby" />} />
          <Route path="/circles" element={<Placeholder title="Your circles" />} />
          <Route path="/create" element={<Placeholder title="Create activity" />} />
          <Route path="/profile" element={<Placeholder title="Your profile" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}