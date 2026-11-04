import Link from "next/link";

const AUTHOR_URL = "https://www.linkedin.com/in/mariana-santosf/";

// Rodapé comum a todas as páginas, renderizado uma vez no layout raiz.
export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-3 px-6 py-1 text-sm text-ink-muted">
        <p className="flex min-h-11 items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="var(--color-honey)" />
          </svg>
          Feito com mel por{" "}
          <a href={AUTHOR_URL} className="font-bold text-ink underline hover:text-ink-muted">
            Mari
          </a>
        </p>
        <Link
          href="/design-system"
          className="inline-flex min-h-11 items-center font-medium text-ink underline hover:text-ink-muted"
        >
          Design system
        </Link>
      </div>
    </footer>
  );
}
