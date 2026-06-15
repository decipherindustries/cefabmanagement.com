import Link from "next/link";

export default function NotFound() {
  return (
    <main className="ck-hero-wrap" style={{ minHeight: "60vh" }}>
      <div className="ck-container" style={{ padding: "120px 24px", color: "#fff" }}>
        <h1 className="ck-hero__title" style={{ fontSize: 44 }}>Page not found</h1>
        <p className="ck-hero__lead">
          <Link href="/en" style={{ color: "#fff", textDecoration: "underline" }}>English</Link>
          {" · "}
          <Link href="/nl" style={{ color: "#fff", textDecoration: "underline" }}>Nederlands</Link>
        </p>
      </div>
    </main>
  );
}
