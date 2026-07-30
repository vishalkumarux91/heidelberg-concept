import { NextResponse } from "next/server";
import { validateEnquiry, type EnquiryInput } from "@/lib/validate";

/**
 * Enquiry endpoint — validates, and stops there.
 *
 * IMPORTANT: this does not deliver anywhere. Where enquiries route
 * (central team or nearest dealer) is an open question in the copy deck,
 * and wiring a destination before that is answered would silently drop
 * real leads into a void that looks like it works. It logs and returns
 * success so the front-end states are demonstrable; swap the marked
 * section below for the real transport once routing is decided.
 */
export async function POST(request: Request) {
  let body: Partial<EnquiryInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "malformed" }, { status: 400 });
  }

  const input: EnquiryInput = {
    name: String(body.name ?? ""),
    phone: String(body.phone ?? ""),
    email: String(body.email ?? ""),
    project: String(body.project ?? ""),
  };

  const errors = validateEnquiry(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // ---- Replace with real delivery once routing is confirmed. ----
  console.info("[enquiry] validated, not delivered — routing undecided", {
    name: input.name,
    hasProject: input.project.trim().length > 0,
  });
  // ---------------------------------------------------------------

  return NextResponse.json({ ok: true, delivered: false });
}
