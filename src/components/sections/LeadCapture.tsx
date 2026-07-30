"use client";

import { useId, useRef, useState } from "react";
import { brand, leadCapture } from "@/content/copy";
import { SectionLabel } from "@/components/ui/SectionHead";
import { OpenSlot } from "@/components/ui/OpenSlot";
import { validateEnquiry, type EnquiryInput, type FieldErrors } from "@/lib/validate";

const EMPTY: EnquiryInput = { name: "", phone: "", email: "", project: "" };

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Section 06 — lead capture.
 *
 * Three required fields and one optional, per the deck. Validation runs
 * on submit and then live per-field once a field has been touched, so the
 * form never scolds someone mid-keystroke.
 */
export function LeadCapture() {
  const [values, setValues] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryInput, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const ids = useId();

  const fieldId = (key: keyof EnquiryInput) => `${ids}-${key}`;
  const errorId = (key: keyof EnquiryInput) => `${ids}-${key}-error`;

  function update(key: keyof EnquiryInput, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) {
      setErrors(validateEnquiry(next));
    }
  }

  function blur(key: keyof EnquiryInput) {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validateEnquiry(values));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateEnquiry(values);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true });

    if (Object.keys(found).length > 0) {
      // Move focus to the first problem rather than announcing a count.
      const firstKey = (["name", "phone", "email"] as const).find((k) => found[k]);
      if (firstKey) formRef.current?.querySelector<HTMLInputElement>(`#${CSS.escape(fieldId(firstKey))}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(String(response.status));

      setStatus("success");
      setValues(EMPTY);
      setTouched({});
    } catch {
      setStatus("error");
    }
  }

  const whatsappHref = `https://wa.me/91${leadCapture.whatsapp.number}`;

  return (
    <section id="enquiry" aria-labelledby="enquiry-heading" className="border-t border-rule bg-paper-deep">
      <div className="shell py-24 md:py-36">
        <div className="editorial">
          <SectionLabel index="06">{leadCapture.label}</SectionLabel>

          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
            <div>
              <h2
                id="enquiry-heading"
                className="display max-w-[14ch] text-[length:var(--text-display)]"
              >
                {leadCapture.headline}
              </h2>
              <p className="prose-body mt-7 max-w-[44ch]">{leadCapture.subhead}</p>

              {/* Not decoration. Cement brands in India are routinely
                  impersonated for advance-payment fraud. */}
              <aside className="mt-12 border-l-2 border-oxide bg-paper py-5 pl-6 pr-5">
                <h3 className="label-tag text-oxide">{leadCapture.trust.heading}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {leadCapture.trust.body}
                </p>
              </aside>

              <div className="mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.9375rem]">
                <span className="text-ink-muted">{leadCapture.whatsapp.prompt}</span>
                <a
                  href={whatsappHref}
                  className="text-ink underline decoration-oxide decoration-2 underline-offset-4 transition-colors hover:text-oxide"
                >
                  {leadCapture.whatsapp.body}
                </a>
                <span className="numerals text-ink-muted">— {leadCapture.whatsapp.number}</span>
              </div>
            </div>

            <div>
              {status === "success" ? (
                <SuccessPanel onReset={() => setStatus("idle")} />
              ) : (
                <form ref={formRef} onSubmit={submit} noValidate className="space-y-7">
                  <Field
                    id={fieldId("name")}
                    errorId={errorId("name")}
                    label={leadCapture.fields.name.label}
                    placeholder={leadCapture.fields.name.placeholder}
                    value={values.name}
                    error={touched.name ? errors.name : undefined}
                    autoComplete="name"
                    onChange={(v) => update("name", v)}
                    onBlur={() => blur("name")}
                  />
                  <Field
                    id={fieldId("phone")}
                    errorId={errorId("phone")}
                    label={leadCapture.fields.phone.label}
                    placeholder={leadCapture.fields.phone.placeholder}
                    value={values.phone}
                    error={touched.phone ? errors.phone : undefined}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    onChange={(v) => update("phone", v)}
                    onBlur={() => blur("phone")}
                  />
                  <Field
                    id={fieldId("email")}
                    errorId={errorId("email")}
                    label={leadCapture.fields.email.label}
                    placeholder={leadCapture.fields.email.placeholder}
                    value={values.email}
                    error={touched.email ? errors.email : undefined}
                    type="email"
                    autoComplete="email"
                    onChange={(v) => update("email", v)}
                    onBlur={() => blur("email")}
                  />
                  <Field
                    id={fieldId("project")}
                    errorId={errorId("project")}
                    label={leadCapture.fields.project.label}
                    placeholder={leadCapture.fields.project.placeholder}
                    value={values.project}
                    optional
                    onChange={(v) => update("project", v)}
                  />

                  <div aria-live="assertive">
                    {status === "error" ? (
                      <p className="border-l-2 border-oxide bg-oxide/8 py-3 pl-4 text-[0.9375rem] text-oxide-deep">
                        {leadCapture.states.errorGeneral}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group inline-flex w-full cursor-pointer items-center justify-between gap-4 bg-ink px-7 py-5 text-lg text-paper transition-colors hover:bg-oxide disabled:cursor-wait disabled:opacity-60 sm:w-auto"
                  >
                    {status === "submitting" ? leadCapture.submitting : leadCapture.submit}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>

                  <p className="max-w-[42ch] text-sm leading-relaxed text-ink-muted">
                    {leadCapture.privacy}
                  </p>

                  <div className="open-item-anchor">
                    <OpenSlot item={leadCapture.routingOpen} />
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-rule">
        <div className="shell flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 py-12">
          <p className="display max-w-[20ch] text-2xl md:text-3xl">{brand.signOff}</p>
          <p className="label-tag text-ink-muted">{brand.eyebrow}</p>
        </div>
      </footer>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  id,
  errorId,
  label,
  placeholder,
  value,
  error,
  type = "text",
  inputMode,
  autoComplete,
  optional = false,
  onChange,
  onBlur,
}: {
  id: string;
  errorId: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  inputMode?: "numeric" | "text";
  autoComplete?: string;
  optional?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="label-tag flex items-baseline gap-2 text-ink-muted">
        {label}
        {optional ? <span className="text-ink-faint normal-case">(optional)</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`mt-3 w-full border-0 border-b bg-transparent pb-3 text-lg text-ink transition-colors placeholder:text-ink-faint focus:outline-none ${
          error ? "border-b-2 border-oxide" : "border-b border-rule-strong focus:border-ink"
        }`}
      />
      <div aria-live="polite">
        {error ? (
          <p id={errorId} className="mt-2.5 text-sm text-oxide-deep">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <div role="status" className="border-l-2 border-ink bg-paper p-8">
      <p className="display text-3xl">{leadCapture.states.success}</p>
      <button
        type="button"
        onClick={onReset}
        className="label-tag mt-8 cursor-pointer text-oxide underline underline-offset-4 transition-colors hover:text-ink"
      >
        Send another enquiry
      </button>
    </div>
  );
}
