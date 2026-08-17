import {
  ArrowLeft,
  Building2,
  Camera,
  Car,
  Check,
  ChevronRight,
  Droplets,
  Flag,
  Megaphone,
  Radar,
  Search,
  Shield,
  Siren,
  Upload,
  Zap,
} from "lucide-react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Success from "./pages/Success";
import Subscribe from "./pages/Subscribe";
import Track from "./pages/Track";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminTabs from "./pages/admin/AdminTabs";

export type Category = {
  id: string;
  name: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  subcategories: readonly string[];
};

const CATEGORIES = [
  {
    id: "safety",
    name: "Safety & Security",
    Icon: Shield,
    subcategories: ["Crime", "Suspicious activity", "Dangerous locations", "Public safety hazards"],
  },
  {
    id: "roads",
    name: "Roads & Transportation",
    Icon: Car,
    subcategories: ["Bad roads / potholes", "Dangerous driving", "Unroadworthy vehicles", "Broken traffic lights", "Illegal parking", "Public transport issues"],
  },
  {
    id: "buildings",
    name: "Building & Infrastructure",
    Icon: Building2,
    subcategories: [
      "Unsafe/damaged buildings",
      "Collapsed structures",
      "Construction hazards",
      "Illegal construction",
      "Exposed electrical wires",
      "Broken streetlights",
      "Water infrastructure",
      "Damaged public infrastructure",
    ],
  },
  {
    id: "flooding",
    name: "Environment & Flooding",
    Icon: Droplets,
    subcategories: ["Blocked drainage", "Flooding", "Open manholes", "Erosion"],
  },
  {
    id: "elections",
    name: "Elections",
    Icon: Flag,
    subcategories: ["Voter intimidation", "Violence at polling units", "Missing election materials", "Other electoral issues"],
  },
  {
    id: "emergencies",
    name: "Others",
    Icon: Siren,
    subcategories: ["Fire", "Accident", "Medical emergency", "Other immediate danger"],
  },
] as const;

const HOW_IT_WORKS = [
  { label: "Take a picture", Icon: Camera },
  { label: "Upload it", Icon: Upload },
  { label: "Authority acts", Icon: Radar },
] as const;

function App() {
  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased">
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminTabs />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <AdminTabs />
            </AdminLayout>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <header className="sticky top-0 z-50 border-b-2 border-black/10 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
                  <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black">
                      <Megaphone className="h-4.5 w-4.5 text-white" strokeWidth={2.2} />
                    </div>
                    <p className="text-lg font-bold tracking-tight text-black">Civres</p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/track"
                      className="rounded-full border-2 border-black/10 bg-white px-3.5 py-1.5 text-xs font-semibold text-black/60 transition-colors hover:border-black hover:text-black"
                    >
                      Track a report
                    </Link>
                  </div>
                </div>
              </header>

              <main className="mx-auto max-w-6xl px-6 pb-28">
                <Routes>
                  <Route path="/" element={<Home categories={CATEGORIES} howItWorks={HOW_IT_WORKS} />} />
                  <Route path="/report/:categoryId" element={<Report categories={CATEGORIES} />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/track" element={<Track />} />
                  <Route path="/track/:trackingId" element={<Track />} />
                  <Route path="/subscribe" element={<Subscribe />} />
                </Routes>
              </main>

              <footer className="border-t-2 border-black/10 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-12">
                  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm font-bold text-black">Civres</p>
                      <p className="mt-2 text-sm leading-relaxed text-black/55">
                        A simple tool for Nigerians to report civic issues, including bad roads, reckless driving, broken lights, flooding, and more, directly to the authorities. We follow up with all reports and provide updates.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">Platform</p>
                      <ul className="mt-3 space-y-2 text-sm text-black/55">
                        <li>
                          <Link to="/" className="transition-colors hover:text-black">
                            Report an issue
                          </Link>
                        </li>
                        <li>
                          <span className="text-black/30">Anonymous &amp; secure</span>
                        </li>
                        <li>
                          <span className="text-black/30">Real-time tracking</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">About</p>
                      <p className="mt-2 text-sm leading-relaxed text-black/55">
                        Built to help Nigerians speak up and get things done
                      </p>
                    </div>
                  </div>
                  <div className="mt-10 border-t-2 border-black/10 pt-6 text-center text-xs text-black/40">
                    &copy; {new Date().getFullYear()} Civres. See Something, Say Something.
                  </div>
                </div>
              </footer>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
