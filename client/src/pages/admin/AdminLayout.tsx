import { useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Megaphone } from "lucide-react";

type AdminLayoutProps = {
  children: ReactNode;
};

const NAV_ITEMS = [
  { path: "/admin", label: "Reports", exact: true },
  { path: "/admin/authorities", label: "Authorities" },
];

function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  function logout() {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`flex flex-col border-r-2 border-black/10 bg-white transition-all ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b-2 border-black/10">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-black">
            <Megaphone className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
          </div>
          {!collapsed && (
            <p className="text-lg font-bold tracking-tight text-black">Civres</p>
          )}
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                isActive(item.path, item.exact)
                  ? "bg-black text-white"
                  : "text-black/60 hover:bg-black/5 hover:text-black"
              }`}
            >
              {!collapsed && item.label}
            </button>
          ))}
        </nav>

        <div className="border-t-2 border-black/10 p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-black/40 hover:text-black"
          >
            {collapsed ? "→" : "← Collapse"}
          </button>
          <button
            onClick={logout}
            className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-black/40 hover:text-black"
          >
            {collapsed ? "↪" : "Logout"}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
