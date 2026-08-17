import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, CheckCircle2, Clock, Send } from "lucide-react";
import { apiUrl } from "../utils/api";

type ReportStatus = {
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
  assignedTo: string | null;
  notes: string | null;
  trackingId: string | null;
};

const STATUS_STEPS = [
  { key: "pending", label: "Report received", Icon: Clock },
  { key: "under_review", label: "Under review", Icon: Search },
  { key: "assigned", label: "Sent to authority", Icon: Send },
  { key: "resolved", label: "Resolved", Icon: CheckCircle2 },
];

function getStatusIndex(status: string) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function TrackLookup({ onFound }: { onFound: (report: ReportStatus) => void }) {
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = trackingId.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/reports/track/${trimmed}`));
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Report not found");
      }
      const data = await res.json();
      onFound(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg pt-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-black text-white">
        <Search className="h-7 w-7" strokeWidth={2} />
      </div>
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-black sm:text-5xl">
        Track a report
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-black/55">
        Enter the report ID you received after submitting your report to see its current status.
      </p>
      <form onSubmit={submit} className="mx-auto mt-8 max-w-md">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter report ID"
            className="flex-1 rounded-xl border-2 border-black/15 bg-white px-4 py-3 text-center text-lg font-bold tracking-widest uppercase outline-none transition-colors placeholder:text-black/30 focus:border-black focus:ring-2 focus:ring-black/20 sm:text-left"
          />
          <button
            type="submit"
            disabled={loading || !trackingId.trim()}
            className="rounded-full border-2 border-black bg-black px-6 py-3 text-sm font-bold text-white transition-all hover:bg-black/80 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white"
          >
            {loading ? "Checking..." : "Track"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>
      <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black/45 transition-colors hover:text-black">
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>
    </section>
  );
}

function TrackResult({ report, onBack }: { report: ReportStatus; onBack: () => void }) {
  const currentIdx = getStatusIndex(report.status);

  return (
    <section className="mx-auto max-w-2xl pt-10">
      <button
        type="button"
        onClick={onBack}
        className="group flex items-center gap-2 text-sm font-semibold text-black/45 transition-colors hover:text-black"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Track another report
      </button>

      <div className="mt-6 rounded-3xl border-2 border-black/10 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-black">{report.categoryName}</p>
            <p className="text-xs text-black/45">{report.area}, {report.state}</p>
          </div>
          <span className="rounded-full border-2 border-black/10 px-3 py-1 text-xs font-bold text-black/60">
            {report.severity}
          </span>
        </div>

        <p className="mt-4 text-sm text-black/70 leading-relaxed">{report.description}</p>

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-black/50">Status</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            {STATUS_STEPS.map((step, idx) => {
              const isCurrent = step.key === report.status;
              const isPast = idx < currentIdx;
              const Icon = step.Icon;
              return (
                <div key={step.key} className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      isCurrent
                        ? "border-black bg-black text-white"
                        : isPast
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/20"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`text-xs font-bold sm:text-sm ${
                      isCurrent || isPast ? "text-black" : "text-black/40"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {report.notes && (
          <div className="mt-6 rounded-xl border-2 border-black/10 bg-black/[0.02] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-black/50">Latest update</p>
            <p className="mt-1 text-sm text-black/70">{report.notes}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-black/50">Evidence</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {(() => {
              try {
                const photos = report.photos ? JSON.parse(report.photos) : [];
                return photos.map((photo: string, idx: number) => (
                  <a key={idx} href={photo} target="_blank" rel="noreferrer">
                    <img src={photo} alt={`Photo ${idx + 1}`} className="h-24 w-24 rounded-lg border-2 border-black/10 object-cover" />
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
              <video controls src={report.video} className="h-40 w-64 rounded-lg border-2 border-black/10 object-cover">
                Your browser does not support video.
              </video>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Track() {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [report, setReport] = useState<ReportStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (trackingId) {
      setError("");
      setReport(null);
      fetch(apiUrl(`/api/reports/track/${trackingId}`))
        .then((res) => {
          if (!res.ok) {
            return res.json().then((data) => Promise.reject(data.error || "Not found"));
          }
          return res.json();
        })
        .then((data) => setReport(data.report))
        .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
    }
  }, [trackingId]);

  if (trackingId) {
    if (error) {
      return (
        <section className="mx-auto max-w-lg pt-20 text-center">
          <h1 className="text-2xl font-bold text-black">Report not found</h1>
          <p className="mt-4 text-black/55">{error}</p>
          <Link to="/track" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black underline">
            Try another ID
          </Link>
        </section>
      );
    }
    if (!report) {
      return <div className="p-6 text-sm text-black/55">Loading...</div>;
    }
    return <TrackResult report={report} onBack={() => { setReport(null); setError(""); }} />;
  }

  if (report) {
    return <TrackResult report={report} onBack={() => { setReport(null); setError(""); }} />;
  }

  return <TrackLookup onFound={(r) => { setReport(r); setError(""); }} />;
}

export default Track;
