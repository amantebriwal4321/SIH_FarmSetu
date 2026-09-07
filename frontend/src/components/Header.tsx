import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b" style={{ background: "var(--surface)" }}>
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <div className="leading-none">
            <div style={{ fontWeight: 700, letterSpacing: "-0.01em" }}>Kisan Setu</div>
            <div className="faint" style={{ fontSize: 11 }}>Glut-to-Value engine</div>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-2">
          <span className="pill">
            <span className="badge-dot" style={{ background: "var(--brand)" }} />
            Kolar, Karnataka · live
          </span>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  // A bridge (setu) over a rising field — flat geometric primitives.
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--brand)" />
      <path d="M6 21c4-6 16-6 20 0" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="8" y="21" width="2.4" height="5" rx="1" fill="#fff" />
      <rect x="21.6" y="21" width="2.4" height="5" rx="1" fill="#fff" />
      <circle cx="16" cy="11.5" r="2.2" fill="#bff0cf" />
    </svg>
  );
}
