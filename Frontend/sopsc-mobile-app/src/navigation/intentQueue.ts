/**
 * Simple in-memory holder for a pending navigation URL.
 * Allows notification handlers or link listeners to stash a
 * deep link until navigation and auth gating are ready to consume it.
 */
let pendingUrl: string | null = null;

export const setPendingUrl = (url: string | null): void => {
  pendingUrl = url;
};

export const consumePendingUrl = (): string | null => {
  const url = pendingUrl;
  pendingUrl = null;
  return url;
};