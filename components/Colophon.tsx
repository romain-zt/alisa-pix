export function Colophon() {
  return (
    <footer className="pt-24 md:pt-32 pb-10 md:pb-14 px-6">
      <div className="max-w-sm">
        <p className="text-[var(--text-micro)] tracking-[0.25em] uppercase text-text-muted mb-5">
          Vasilisa
        </p>
        <p className="text-[var(--text-caption)] text-text-muted leading-relaxed mb-1">
          Boudoir photography
        </p>
        <p className="text-[var(--text-caption)] text-text-muted leading-relaxed mb-4">
          Paris
        </p>
        <a
          href="mailto:hello@vasilisa.com"
          className="text-[var(--text-caption)] text-accent underline underline-offset-4 decoration-accent-soft"
        >
          hello@vasilisa.com
        </a>
      </div>
    </footer>
  )
}
