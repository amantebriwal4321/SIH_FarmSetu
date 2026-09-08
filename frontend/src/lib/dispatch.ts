// Live handshake between the Admin console and the Farmer app with NO backend.
// Uses BroadcastChannel (instant, same browser, across tabs/windows) + localStorage
// (so a farmer tab opened later still sees the latest pending alert). This is what
// makes "officer sends → farmer receives → farmer accepts → officer sees confirmed"
// work live on stage without Twilio or a server.

export type Dispatch = {
  id: string;
  cropSlug: string;
  cropName: string;
  unitName: string;
  offer: number;
  crash: number;
  farmers: number;
  english: string;
  hindi: string;
  ts: number;
  status: "pending" | "accepted" | "declined";
};

const CHANNEL = "kisan-setu";
const LS_DISPATCH = "ks_dispatch";
const LS_CONFIRM = "ks_confirm";

function chan(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHANNEL);
}

export function sendDispatch(d: Dispatch) {
  try {
    localStorage.setItem(LS_DISPATCH, JSON.stringify(d));
  } catch {}
  const c = chan();
  c?.postMessage({ type: "dispatch", payload: d });
  c?.close();
}

export function readLatestDispatch(): Dispatch | null {
  try {
    const raw = localStorage.getItem(LS_DISPATCH);
    return raw ? (JSON.parse(raw) as Dispatch) : null;
  } catch {
    return null;
  }
}

export function respondDispatch(id: string, status: "accepted" | "declined") {
  const payload = { id, status, ts: Date.now() };
  try {
    localStorage.setItem(LS_CONFIRM, JSON.stringify(payload));
    const d = readLatestDispatch();
    if (d && d.id === id) localStorage.setItem(LS_DISPATCH, JSON.stringify({ ...d, status }));
  } catch {}
  const c = chan();
  c?.postMessage({ type: "confirm", payload });
  c?.close();
}

export function onDispatch(cb: (d: Dispatch) => void): () => void {
  const c = chan();
  if (!c) return () => {};
  const handler = (e: MessageEvent) => {
    if (e.data?.type === "dispatch") cb(e.data.payload as Dispatch);
  };
  c.addEventListener("message", handler);
  return () => {
    c.removeEventListener("message", handler);
    c.close();
  };
}

export function onConfirm(cb: (p: { id: string; status: string }) => void): () => void {
  const c = chan();
  if (!c) return () => {};
  const handler = (e: MessageEvent) => {
    if (e.data?.type === "confirm") cb(e.data.payload);
  };
  c.addEventListener("message", handler);
  return () => {
    c.removeEventListener("message", handler);
    c.close();
  };
}
