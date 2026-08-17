import { useState, useEffect, type FormEvent } from "react";

type Authority = {
  id: string;
  name: string;
  type: string;
  contact: string | null;
};

function AdminAuthorities() {
  const [items, setItems] = useState<Authority[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthorities();
  }, []);

  async function loadAuthorities() {
    try {
      const res = await fetch("/api/authorities");
      const data = await res.json();
      setItems(data.authorities || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/authorities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type, contact }),
    });
    setName("");
    setType("");
    setContact("");
    loadAuthorities();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Authorities</h1>
        <p className="mt-1 text-sm text-black/55">Add police, DSS, emergency services, and other responders.</p>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" onSubmit={submit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g. Lagos Police Command)"
          required
          className="flex-1 min-w-[200px] rounded-xl border-2 border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
        />
        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type (e.g. Police)"
          required
          className="w-40 rounded-xl border-2 border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Contact (phone/email)"
          className="w-56 rounded-xl border-2 border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black"
        />
        <button
          type="submit"
          className="rounded-full border-2 border-black bg-black px-5 py-2 text-sm font-bold text-white hover:bg-black/80"
        >
          Add
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {loading && <p className="text-sm text-black/55">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-black/55">No authorities added yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border-2 border-black/10 bg-white px-4 py-3">
            <div>
              <p className="text-sm font-bold text-black">{item.name}</p>
              <p className="text-xs text-black/45">{item.type}</p>
            </div>
            <span className="text-xs text-black/40">{item.contact || "No contact"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAuthorities;
