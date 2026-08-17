import { useState, useEffect, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../utils/api";

type Report = {
  id: string;
  categoryName: string;
  description: string;
  area: string;
  state: string;
  severity: string;
  status: string;
  createdAt: string;
  photos: string | null;
  audio: string | null;
  video: string | null;
  contactMethod: string;
  contactValue: string | null;
  assignedTo: string | null;
  messageStatus: string | null;
  trackingId: string | null;
};

type Authority = {
  id: string;
  name: string;
  type: string;
  contact: string | null;
};

function MultiSelectDropdown({
  authorities,
  selectedIds,
  onToggle,
  onClear,
}: {
  authorities: Authority[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = authorities.filter((a) => selectedIds.includes(a.id));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border-2 border-black/15 bg-white px-4 py-2.5 text-left text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20"
      >
        <span className="truncate text-black/70">
          {selected.length === 0
            ? "Assign authorities..."
            : `${selected.length} authorit${selected.length === 1 ? "y" : "ies"} selected`}
        </span>
        <svg
          className={`h-4 w-4 flex-shrink-0 text-black/50 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border-2 border-black/10 bg-white shadow-lg">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5 border-b-2 border-black/5 p-2">
              {selected.map((auth) => (
                <span
                  key={auth.id}
                  className="flex items-center gap-1 rounded-full border border-black bg-black px-2 py-1 text-xs font-bold text-white"
                >
                  {auth.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(auth.id);
                    }}
                    className="text-white/70 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="text-xs font-semibold text-black/40 hover:text-black"
              >
                Clear all
              </button>
            </div>
          )}
          <div className="p-1">
            {authorities.length === 0 && (
              <p className="p-2 text-xs text-black/40">No authorities found.</p>
            )}
            {authorities.map((auth) => {
              const isSelected = selectedIds.includes(auth.id);
              return (
                <button
                  key={auth.id}
                  type="button"
                  onClick={() => onToggle(auth.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-black text-white"
                      : "text-black hover:bg-black/5"
                  }`}
                >
                  <span className="font-medium">{auth.name}</span>
                  <span className={`text-xs ${isSelected ? "text-white/70" : "text-black/40"}`}>
                    {auth.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthorities, setSelectedAuthorities] = useState<Record<string, string[]>>({});
  const [messageStatuses, setMessageStatuses] = useState<Record<string, string>>({});
  const [assignStatuses, setAssignStatuses] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, []);

  const categories = Array.from(new Set(reports.map((r) => r.categoryName).filter(Boolean)));

  function getAssignedIds(report: Report): string[] {
    try {
      return report.assignedTo ? JSON.parse(report.assignedTo) : [];
    } catch {
      return [];
    }
  }

  function toggleAuthority(reportId: string, authId: string) {
    setSelectedAuthorities((prev) => {
      const current = prev[reportId] || getAssignedIds(reports.find((r) => r.id === reportId)!);
      const next = current.includes(authId)
        ? current.filter((id) => id !== authId)
        : [...current, authId];
      return { ...prev, [reportId]: next };
    });
  }

  async function assignAuthorities(reportId: string) {
    const ids = selectedAuthorities[reportId] || [];
    setAssignStatuses((prev) => ({ ...prev, [reportId]: "pending" }));
      await fetch(apiUrl(`/api/reports/${reportId}/assign`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorityIds: ids }),
    });
    setAssignStatuses((prev) => ({ ...prev, [reportId]: "assigned" }));
    setTimeout(() => {
      setAssignStatuses((prev) => ({ ...prev, [reportId]: "none" }));
    }, 2000);
    loadData();
  }

  async function sendMessage(reportId: string, message: string) {
    setMessageStatuses((prev) => ({ ...prev, [reportId]: "pending" }));
      await fetch(apiUrl(`/api/reports/${reportId}/message`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setMessageStatuses((prev) => ({ ...prev, [reportId]: "sent" }));
    setTimeout(() => {
      setMessageStatuses((prev) => ({ ...prev, [reportId]: "none" }));
    }, 2000);
    loadData();
  }

  async function loadData() {
    try {
      const [reportsRes, authRes] = await Promise.all([
        fetch(apiUrl("/api/reports")),
        fetch(apiUrl("/api/authorities")),
      ]);
      const reportsData = await reportsRes.json();
      const authData = await authRes.json();
      setReports(reportsData.reports || []);
      setAuthorities(authData.authorities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(reportId: string, status: string) {
      await fetch(apiUrl(`/api/reports/${reportId}/status`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  const filteredReports = reports.filter((report) => {
    if (categoryFilter && report.categoryName !== categoryFilter) return false;
    if (!filter) return true;
    const search = filter.toLowerCase();
    return (
      report.categoryName.toLowerCase().includes(search) ||
      report.area.toLowerCase().includes(search) ||
      report.state.toLowerCase().includes(search) ||
      report.description.toLowerCase().includes(search)
    );
  });

  if (loading) return <div className="p-6 text-sm text-black/55">Loading...</div>;

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-black">Reports</h2>
          <p className="text-xs text-black/40">Review and assign reports to authorities</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border-2 border-black/15 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search reports..."
            className="w-full rounded-xl border-2 border-black/15 bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20 sm:w-72"
          />
        </div>
      </div>
      <div className="space-y-4">
        {filteredReports.length === 0 && (
          <p className="text-sm text-black/55">No reports match your search.</p>
        )}
        {filteredReports.map((report) => {
          const assignedIds = getAssignedIds(report);
          const selectedIds = selectedAuthorities[report.id] || [];
          const messageStatus = messageStatuses[report.id];

          return (
            <div
              key={report.id}
              className="rounded-2xl border-2 border-black/10 bg-white p-6 transition-colors hover:border-black/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-black truncate">{report.categoryName}</p>
                    <span className="rounded-full border-2 border-black/10 px-2.5 py-0.5 text-xs font-bold text-black/60 flex-shrink-0">
                      {report.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-black/45">
                    {report.area}, {report.state}
                  </p>
                </div>
                <span className="text-xs text-black/30 flex-shrink-0">
                  {new Date(report.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black/50">Status:</label>
                <select
                  value={report.status}
                  onChange={(e) => updateStatus(report.id, e.target.value)}
                  className="rounded-lg border-2 border-black/15 bg-white px-3 py-1.5 text-xs font-bold outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20"
                >
                  <option value="pending">Report received</option>
                  <option value="under_review">Under review</option>
                  <option value="assigned">Sent to authority</option>
                  <option value="resolved">Resolved</option>
                </select>
                {report.trackingId && (
                  <span className="rounded-full border-2 border-black/10 px-2.5 py-0.5 text-xs font-bold text-black/50">
                    ID: {report.trackingId}
                  </span>
                )}
              </div>

              {report.contactMethod !== "anonymous" && report.contactValue && (
                <p className="mt-2 text-xs text-black/50">
                  Contact: {report.contactMethod} · {report.contactValue}
                </p>
              )}

              <p className="mt-3 text-sm text-black/70 leading-relaxed">{report.description}</p>

              <div className="mt-3 flex flex-wrap gap-3">
                {(() => {
                  try {
                    const photos = report.photos ? JSON.parse(report.photos) : [];
                    return photos.map((photo: string, idx: number) => (
                      <a
                        key={idx}
                        href={photo}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        <img
                          src={photo}
                          alt={`Report photo ${idx + 1}`}
                          className="h-24 w-24 rounded-lg border-2 border-black/10 object-cover transition-colors hover:border-black/30"
                        />
                      </a>
                    ));
                  } catch {
                    return null;
                  }
                })()}
                {report.audio && (
                  <audio controls src={report.audio} className="h-10 w-64">
                    Your browser does not support audio.
                  </audio>
                )}
                {report.video && (
                  <video
                    controls
                    src={report.video}
                    className="h-40 w-64 rounded-lg border-2 border-black/10 object-cover"
                  >
                    Your browser does not support video.
                  </video>
                )}
              </div>

              <div className="mt-4 rounded-xl border-2 border-black/10 bg-black/[0.02] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/50">
                      Assign to authorities
                    </label>
                    <MultiSelectDropdown
                      authorities={authorities}
                      selectedIds={selectedIds}
                      onToggle={(authId) => toggleAuthority(report.id, authId)}
                      onClear={() =>
                        setSelectedAuthorities((prev) => ({ ...prev, [report.id]: [] }))
                      }
                    />
                    {assignedIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {assignedIds.map((id) => {
                          const auth = authorities.find((a) => a.id === id);
                          if (!auth) return null;
                          const isSelected = selectedIds.includes(id);
                          return (
                            <span
                              key={id}
                              className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                isSelected
                                  ? "border-black bg-black text-white"
                                  : "border-black/15 bg-white text-black/60"
                              }`}
                            >
                              {auth.name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => assignAuthorities(report.id)}
                      disabled={selectedIds.length === 0}
                      className="rounded-full border-2 border-black bg-black px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-black/80 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white"
                    >
                      Assign
                    </button>
                    {assignStatuses[report.id] === "pending" && (
                      <span className="flex items-center gap-1.5 rounded-full border-2 border-black/10 bg-black/5 px-3 py-1.5 text-xs font-bold text-black/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-black/40 animate-pulse" />
                        Assigning...
                      </span>
                    )}
                    {assignStatuses[report.id] === "assigned" && (
                      <span className="flex items-center gap-1.5 rounded-full border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Assigned
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border-2 border-black/10 bg-black/[0.02] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/50">
                        Send update
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const input = e.target as HTMLFormElement;
                            const msgInput = input.elements.namedItem("message") as HTMLInputElement;
                            if (msgInput.value.trim()) {
                              sendMessage(report.id, msgInput.value.trim());
                              msgInput.value = "";
                            }
                          }}
                          className="flex gap-2"
                        >
                          <input
                            name="message"
                            placeholder="Type update..."
                            className="w-40 rounded-xl border-2 border-black/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20 sm:w-auto"
                          />
                          <button
                            type="submit"
                            className="rounded-full border-2 border-black bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-black/80"
                          >
                            Send
                          </button>
                        </form>
                        {messageStatus === "pending" && (
                          <span className="flex items-center gap-1.5 rounded-full border-2 border-black/10 bg-black/5 px-3 py-1.5 text-xs font-bold text-black/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-black/40 animate-pulse" />
                            Pending...
                          </span>
                        )}
                        {messageStatus === "sent" && (
                          <span className="flex items-center gap-1.5 rounded-full border-2 border-black bg-black px-3 py-1.5 text-xs font-bold text-white">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Sent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default AdminDashboard;
