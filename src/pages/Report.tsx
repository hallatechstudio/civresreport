import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  Mic,
  X,
  MapPin,
} from "lucide-react";
import type { Category } from "../App";

const STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Kano",
  "Oyo",
  "Enugu",
  "Kaduna",
  "Delta",
  "Anambra",
  "Ogun",
];

const SEVERITIES = ["Low", "Medium", "Urgent"] as const;

type Step = "form" | "done";

type ReportProps = {
  categories: readonly Category[];
};

function Report({ categories }: ReportProps) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [customIssue, setCustomIssue] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [state, setState] = useState<string>(STATES[0]!);
  const [severity, setSeverity] = useState<string>("Medium");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return (
      <div className="mx-auto max-w-2xl pt-14">
        <p className="text-sm text-black/55">Category not found.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-black underline">
          Go home
        </Link>
      </div>
    );
  }

  const canSubmit =
    subcategories.length > 0 &&
    description.trim().split(/\s+/).filter(Boolean).length >= 4 &&
    area.trim().length > 1;

  function reset() {
    setSubcategories([]);
    setCustomIssue("");
    setShowCustomInput(false);
    setDescription("");
    setArea("");
    setSeverity("Medium");
    setPhotoPreview(null);
    setPhotoName(null);
    setAudioName(null);
    setAudioUrl(null);
    navigate("/");
  }

  function toggleSubcategory(s: string) {
    setSubcategories((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function addCustomSubcategory() {
    const trimmed = customIssue.trim();
    if (!trimmed) return;
    setSubcategories((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setCustomIssue("");
    setShowCustomInput(false);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStep("done");
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhotoPreview(null);
    setPhotoName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleAudioChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioName(file.name);
    setAudioUrl(URL.createObjectURL(file));
  }

  function removeAudio() {
    setAudioName(null);
    setAudioUrl(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
  }

  const severityStyle: Record<string, string> = {
    Low: "border-black bg-black text-white",
    Medium: "border-black bg-black text-white",
    Urgent: "border-black bg-black text-white",
  };

  if (step === "done") {
    return (
      <section className="mx-auto max-w-lg pt-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black">
          <Check className="h-9 w-9 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight text-black sm:text-5xl">
          Report submitted.
        </h1>

        <p className="mx-auto mt-6 max-w-sm text-black/55">
          Your report has been received and is now visible to the
          relevant authority in real time.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full border-2 border-black px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-black hover:text-white"
        >
          Report another issue
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl pt-14">
      <button
        type="button"
        onClick={reset}
        className="group flex items-center gap-2 text-sm font-semibold text-black/45 transition-colors hover:text-black"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Change category
      </button>

      <div className="mt-6">
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-1.5 text-xs font-bold text-white">
          Step 2 of 2 · {category.name}
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-black sm:text-5xl">
          Tell us what happened.
        </h1>
        <p className="mt-3 text-black/55">
          Provide a clear description so the right authority can act quickly.
        </p>
      </div>

      <form onSubmit={submit} className="mt-10 space-y-7 rounded-3xl border-2 border-black/10 bg-white p-8">
        <div>
          <p className="text-sm font-bold text-black">Issue type</p>
          <p className="mt-1 text-xs text-black/40">Select all that apply.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ...(category.subcategories ?? []),
              ...subcategories.filter(
                (s) => !(category.subcategories as readonly string[] | undefined)?.includes(s)
              ),
            ].map((s) => {
              const selected = subcategories.includes(s);
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSubcategory(s)}
                  aria-pressed={selected}
                  className={`flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-black/15 bg-white text-black hover:border-black/40"
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                  {s}
                </button>
              );
            })}

            {showCustomInput ? (
              <div className="flex items-center gap-1.5 rounded-full border-2 border-black bg-white pl-4 pr-1.5 py-1">
                <input
                  autoFocus
                  value={customIssue}
                  onChange={(e) => setCustomIssue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSubcategory();
                    }
                    if (e.key === "Escape") {
                      setShowCustomInput(false);
                      setCustomIssue("");
                    }
                  }}
                  placeholder="Describe it…"
                  className="w-32 bg-transparent text-sm outline-none placeholder:text-black/35 sm:w-40"
                />
                <button
                  type="button"
                  onClick={addCustomSubcategory}
                  aria-label="Add issue type"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-black/80"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomIssue("");
                  }}
                  aria-label="Cancel"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-black/25 px-4 py-2 text-sm font-semibold text-black/55 transition-colors hover:border-black hover:text-black"
              >
                + Other
              </button>
            )}
          </div>
          {subcategories.length === 0 && (
            <p className="mt-2 text-xs text-black/40">Select at least one issue type to continue.</p>
          )}
        </div>

        <div>
          <label htmlFor="desc" className="text-sm font-bold text-black">
            Description
          </label>
          <textarea
            id="desc"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue as clearly as you can…"
            className="mt-2 w-full resize-none rounded-xl border-2 border-black/15 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black/20"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="area" className="text-sm font-bold text-black">
              Area / landmark
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/20">
              <MapPin className="h-4 w-4 text-black/35" />
              <input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Ojuelegba Bridge"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-black/35"
              />
            </div>
          </div>
          <div>
            <label htmlFor="state" className="text-sm font-bold text-black">
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="mt-2 w-full rounded-xl border-2 border-black/15 bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-2 focus:ring-black/20"
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-black">Severity</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {SEVERITIES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSeverity(s)}
                className={`rounded-full border-2 px-5 py-2 text-sm font-bold transition-all ${
                  severity === s
                    ? severityStyle[s]
                    : "border-black/12 bg-white text-black/45 hover:border-black/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <input
            ref={fileInputRef}
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          {photoPreview ? (
            <div className="flex items-center gap-4 rounded-xl border-2 border-black bg-white p-3">
              <img
                src={photoPreview}
                alt="Attached preview"
                className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-bold text-black">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  Photo attached
                </p>
                <p className="truncate text-xs text-black/45">{photoName}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-black hover:text-white"
                >
                  Change
                </label>
                <button
                  type="button"
                  onClick={removePhoto}
                  aria-label="Remove photo"
                  className="rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="photo-upload"
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-black/25 bg-white p-4 text-sm font-medium text-black/55 transition-colors hover:border-black hover:text-black"
            >
              <Camera className="h-5 w-5" />
              Attach a photo (optional)
            </label>
          )}
        </div>

        <div>
          <input
            ref={audioInputRef}
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="hidden"
          />
          {audioUrl ? (
            <div className="flex items-center gap-4 rounded-xl border-2 border-black bg-white p-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-black text-white">
                <Mic className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-sm font-bold text-black">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  Audio attached
                </p>
                <p className="truncate text-xs text-black/45">{audioName}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold text-black transition-colors hover:bg-black hover:text-white"
                >
                  Change
                </label>
                <button
                  type="button"
                  onClick={removeAudio}
                  aria-label="Remove audio"
                  className="rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/5 hover:text-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="audio-upload"
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-black/25 bg-white p-4 text-sm font-medium text-black/55 transition-colors hover:border-black hover:text-black"
            >
              <Mic className="h-5 w-5" />
              Attach an audio clip (optional)
            </label>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-black/80 disabled:opacity-30 disabled:hover:bg-black disabled:hover:text-white"
          >
            Submit report
          </button>
          <p className="text-xs text-black/40">
            Reports are anonymous. No personal data required.
          </p>
        </div>
      </form>
    </section>
  );
}

export default Report;
