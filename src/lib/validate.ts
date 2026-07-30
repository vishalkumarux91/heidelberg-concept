import { leadCapture } from "@/content/copy";

export type EnquiryInput = {
  name: string;
  phone: string;
  email: string;
  project: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

/** Indian mobile numbers: ten digits, first digit 6–9. Spacing is ignored. */
export function normalisePhone(raw: string): string {
  return raw.replace(/\D/g, "").replace(/^(?:91|0)(?=\d{10}$)/, "");
}

/**
 * Shared by the form and the route handler, so the client can't relax a
 * rule the server enforces (or vice versa).
 */
export function validateEnquiry(input: EnquiryInput): FieldErrors {
  const errors: FieldErrors = {};
  const { states } = leadCapture;

  if (input.name.trim().length < 2) {
    errors.name = states.errorName;
  }

  if (!/^[6-9]\d{9}$/.test(normalisePhone(input.phone))) {
    errors.phone = states.errorPhone;
  }

  // Deliberately loose: the goal is catching typos, not policing RFC 5322.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email.trim())) {
    errors.email = states.errorEmail;
  }

  return errors;
}
