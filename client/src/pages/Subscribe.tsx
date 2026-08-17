import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

function Subscribe() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Stay informed</p>
      <h1 className="mt-3 text-3xl font-bold text-black sm:text-4xl">Subscribe to get intelligent reports</h1>
      <p className="mt-3 text-sm text-black/55 sm:text-base">Get curated insights on civic issues in your area. No spam, unsubscribe anytime.</p>

      {submitted ? (
        <p className="mt-8 text-sm font-semibold text-black">You&apos;re subscribed. We&apos;ll be in touch.</p>
      ) : (
        <>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center" onSubmit={submit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full rounded-full border-2 border-black/15 bg-white px-5 py-2.5 text-sm text-black outline-none placeholder:text-black/40 focus:border-black sm:w-72"
            />
            <button
              type="submit"
              className="rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-black/80"
            >
              Subscribe
            </button>
          </form>

          <p className="mt-4 text-xs text-black/45">
            You can also join our WhatsApp community for updates.
            <br />
            <a
              href="https://chat.whatsapp.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-black underline underline-offset-4 transition-colors hover:text-black/70"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Join group
            </a>
          </p>
        </>
      )}

      <p className="mt-6">
        <Link to="/" className="text-sm font-semibold text-black/50 underline underline-offset-4 transition-colors hover:text-black">
          Back to home
        </Link>
      </p>
    </div>
  );
}

export default Subscribe;
