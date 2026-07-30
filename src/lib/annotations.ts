/**
 * Tiny external store for annotation mode.
 *
 * Lives outside React so `useSyncExternalStore` can read it, which keeps
 * the toggle free of a setState-in-effect cascade and gives correct
 * hydration: the server always renders "off", and the client corrects
 * itself after hydration if sessionStorage says otherwise.
 */

const KEY = "mycem:annotations";

let cached: boolean | null = null;
const listeners = new Set<() => void>();

export function getAnnotations(): boolean {
  if (cached === null) {
    cached =
      typeof window !== "undefined" && window.sessionStorage.getItem(KEY) === "on";
  }
  return cached;
}

/** Server render is always the clean, un-annotated page. */
export function getServerAnnotations(): boolean {
  return false;
}

export function setAnnotations(next: boolean): void {
  if (cached === next) return;
  cached = next;
  try {
    window.sessionStorage.setItem(KEY, next ? "on" : "off");
  } catch {
    // Private browsing or blocked storage — the toggle still works for
    // this page view, it just won't survive a reload.
  }
  for (const listener of listeners) listener();
}

export function subscribeAnnotations(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
