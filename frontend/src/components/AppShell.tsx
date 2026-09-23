import { NavLink, Outlet } from "react-router-dom";
import { Home, Search, PlusCircle, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Discover", icon: Search },
  { to: "/circles", label: "Circles", icon: Home },
  { to: "/create", label: "Create", icon: PlusCircle },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="sticky top-0 z-20 bg-surface border-b border-black/5 px-4 md:px-8"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between h-16">
          <span className="font-display text-2xl text-primary">nuzu</span>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-ink/60 hover:text-ink"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface border-t border-black/5 flex items-center justify-around"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          height: "calc(64px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-xs ${
                isActive ? "text-primary" : "text-ink/50"
              }`
            }
          >
            <Icon size={22} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}