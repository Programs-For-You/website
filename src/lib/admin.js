// Shared bits for the admin dashboard.
export const card = 'rounded-card-lg border border-border bg-surface p-6';

// created_at is stored as UTC "YYYY-MM-DD HH:MM:SS"; show it in the viewer's timezone.
export const when = (s) => new Date(s.replace(' ', 'T') + 'Z').toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
