import {
  Activity,
  Compass,
  Plus,
  UserCircle,
  Users,
  ShieldCheck,
  Bell,
  LogOut,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

type NavigationItem = {
  label: string;
  path: string;
  icon: typeof Compass;
  end?: boolean;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Discover",
    path: "/",
    icon: Compass,
    end: true,
  },
  {
    label: "Circles",
    path: "/circles",
    icon: Users,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserCircle,
  },
];

export default function AppShell() {
  const navigate = useNavigate();

  const handleLogout = () => {
    /*
     * Keep your existing logout logic here if your current AppShell
     * already clears authentication/session data.
     *
     * For now we simply navigate to login.
     */
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#17211D]">
      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-black/[0.06] bg-white lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex h-[76px] items-center border-b border-black/[0.05] px-6">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F6E56] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Activity size={21} strokeWidth={2.2} />
            </div>

            <div className="text-left">
              <p className="text-[17px] font-bold tracking-[-0.02em] text-[#17211D]">
                Nuzu
              </p>
              <p className="text-[11px] font-medium text-[#7A8580]">
                Connect. Participate.
              </p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9AA39F]">
            Explore
          </p>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#E8F5F0] text-[#0F6E56] shadow-sm"
                        : "text-[#68736E] hover:bg-[#F4F6F5] hover:text-[#17211D]",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.4 : 2}
                        className="transition-transform duration-200 group-hover:scale-105"
                      />

                      <span>{item.label}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#0F6E56]" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Create activity */}
          <div className="mt-7">
            <button
              onClick={() => navigate("/create")}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F6E56] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,110,86,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0B5D49] hover:shadow-[0_12px_24px_rgba(15,110,86,0.22)] active:translate-y-0"
            >
              <Plus
                size={18}
                strokeWidth={2.4}
                className="transition-transform duration-200 group-hover:rotate-90"
              />

              Create activity
            </button>
          </div>

          {/* Bottom section */}
          <div className="mt-auto space-y-2">
            <button
              onClick={() => navigate("/admin")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#68736E] transition-colors hover:bg-[#F4F6F5] hover:text-[#17211D]"
            >
              <ShieldCheck size={19} />
              Admin
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#68736E] transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </div>

        {/* User mini profile */}
        <div className="border-t border-black/[0.05] p-4">
          <button
            onClick={() => navigate("/profile")}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-[#F5F7F6]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDEEE8] text-sm font-bold text-[#0F6E56]">
              U
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#17211D]">
                Your Profile
              </p>

              <p className="truncate text-xs text-[#8A9490]">
                View your activity
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN AREA
      ========================== */}
      <div className="lg:pl-[250px]">
        {/* Desktop top bar */}
        <header className="sticky top-0 z-30 hidden h-[76px] border-b border-black/[0.05] bg-white/85 backdrop-blur-xl lg:flex lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-medium text-[#8A9490]">
              Community
            </p>

            <h1 className="text-[20px] font-bold tracking-[-0.025em] text-[#17211D]">
              Find something to do
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#69736F] transition-colors hover:bg-[#F2F5F3] hover:text-[#17211D]"
            >
              <Bell size={19} />

              <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-[#0F6E56]" />
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DDEEE8] text-sm font-bold text-[#0F6E56] transition-transform hover:scale-105"
            >
              U
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-76px)] px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <div className="mx-auto w-full max-w-[1280px]">
            <Outlet />
          </div>
        </main>
      </div>

      {/* =========================
          MOBILE TOP BAR
      ========================== */}
      <header className="sticky top-0 z-40 flex h-[64px] items-center justify-between border-b border-black/[0.05] bg-white/90 px-4 backdrop-blur-xl lg:hidden">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F6E56] text-white">
            <Activity size={18} />
          </div>

          <span className="text-[17px] font-bold tracking-[-0.02em] text-[#17211D]">
            Nuzu
          </span>
        </button>

        <div className="flex items-center gap-1">
          <button
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#69736F] hover:bg-[#F2F5F3]"
          >
            <Bell size={19} />

            <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-[#0F6E56]" />
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDEEE8] text-xs font-bold text-[#0F6E56]"
          >
            U
          </button>
        </div>
      </header>

      {/* =========================
          MOBILE BOTTOM NAVIGATION
      ========================== */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-1.5"
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={[
                        "flex h-8 w-10 items-center justify-center rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-[#E8F5F0] text-[#0F6E56]"
                          : "text-[#7C8581]",
                      ].join(" ")}
                    >
                      <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                    </div>

                    <span
                      className={[
                        "text-[10px] font-semibold",
                        isActive ? "text-[#0F6E56]" : "text-[#89918E]",
                      ].join(" ")}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Create button */}
          <button
            onClick={() => navigate("/create")}
            className="flex min-w-[64px] flex-col items-center gap-1 px-3 py-1.5"
          >
            <div className="flex h-8 w-10 items-center justify-center rounded-xl bg-[#0F6E56] text-white shadow-sm transition-transform duration-200 active:scale-90">
              <Plus size={19} strokeWidth={2.5} />
            </div>

            <span className="text-[10px] font-semibold text-[#0F6E56]">
              Create
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}