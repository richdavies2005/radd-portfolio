import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

const EMAIL = "radd.designstudio@gmail.com";
const PHONE_DISPLAY = "+64 21 081 45375";
const PHONE_HREF = `tel:${PHONE_DISPLAY.replace(/\s/g, "")}`;
const BLURB =
  "Available for freelance design and photography work — reach out about client projects, collaborations, or opportunities.";

export default function Contact() {
  return (
    <section className="flex min-h-dvh flex-col justify-center gap-8 px-3 py-20 md:px-6">
      <p className="font-label text-xs uppercase tracking-wider text-flame-text">Contact</p>

      <div className="flex flex-col gap-6">
        <h1 className="break-words font-display text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-8xl">
          Richard Davies
        </h1>

        <p className="max-w-md font-body text-lg text-ink-muted">{BLURB}</p>

        <dl className="mt-4 flex flex-col gap-4">
          <div>
            <dt className="font-label text-xs uppercase tracking-wider text-ink-muted">Email</dt>
            <dd>
              <a
                href={`mailto:${EMAIL}`}
                className="break-all font-display text-xl font-bold text-ink transition-colors hover:text-flame-text sm:text-2xl md:text-4xl"
              >
                {EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-label text-xs uppercase tracking-wider text-ink-muted">Phone</dt>
            <dd>
              <a
                href={PHONE_HREF}
                className="font-display text-3xl font-bold text-ink transition-colors hover:text-flame-text md:text-4xl"
              >
                {PHONE_DISPLAY}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
