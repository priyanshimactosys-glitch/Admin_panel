import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Radio,
  Mic,
  Users,
  BarChart3,
  UserCog,
  Settings,
  Phone,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Voice Library", href: "/voice-library", icon: Mic },
  { name: "Campaigns", href: "/campaigns", icon: Radio },
  // { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "User Management", href: "/users", icon: UserCog },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout() {
  const location = useLocation();
   const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    const authData = localStorage.getItem('nvbs_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      setUser({ username: parsed.username, role: parsed.role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nvbs_auth');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200/60 bg-white/60 backdrop-blur-md">

            <div className="flex items-center gap-0">

              {/* Logo Container */}
              <div className="w-20 h-20 rounded-xl bg-white/70   flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.jfif"
                  alt="Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>

              {/* Optional Text (recommended for branding) */}
              <div className="leading-tight">
                <h1 className="text-sm font-semibold text-gray-800 tracking-wide">
                  VOXIS
                </h1>
                <p className="text-[11px] text-gray-500">
                  Admin Panel
                </p>
              </div>

            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== "/" &&
                    location.pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${isActive ? "text-blue-700" : "text-gray-500"
                          }`}
                      />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.username.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">VOXIS</span>
            </div>
            <div className="w-6" />
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
