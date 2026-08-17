import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ChevronRight, Copy, CheckCheck } from "lucide-react";

function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackingId = searchParams.get("trackingId");
  const [copied, setCopied] = useState(false);

  async function copyId() {
    if (!trackingId) return;
    await navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="mx-auto max-w-lg pt-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black">
        <Check className="h-9 w-9 text-white" strokeWidth={2.5} />
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-black sm:text-5xl">
        Report submitted.
      </h1>

      <p className="mx-auto mt-6 max-w-sm text-black/55">
        Your report has been received and is now visible to the relevant authority in real time.
      </p>

      {trackingId && (
        <div className="mx-auto mt-8 rounded-2xl border-2 border-black bg-white p-6 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-black/50">Your report ID</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-center text-2xl font-bold tracking-widest text-black">{trackingId}</p>
            <button
              type="button"
              onClick={copyId}
              className="flex flex-shrink-0 items-center gap-1.5 rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-black hover:text-white"
            >
              {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-black/45">Save this ID to track your report status later</p>
          <button
            type="button"
            onClick={() => navigate(`/track/${trackingId}`)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-black bg-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black/80"
          >
            Track this report
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-6 rounded-full border-2 border-black px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-black hover:text-white"
      >
        Report another issue
      </button>
    </section>
  );
}

export default Success;
