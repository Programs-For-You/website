// Shared Tailwind class strings for form pieces used on several pages.
// Use with cn() from '#lib/cn.js' when you need to add or override something.

/** A text box / <select> / <input type=email>. Add "h-auto min-h-[140px] py-3 leading-normal resize-y" for a textarea. */
export const input =
  'h-[46px] w-full rounded-xl border border-border-strong bg-bg px-3.5 text-base text-ink focus:border-accent focus:ring-[3px] focus:ring-accent-soft focus:outline-none';

/** The little arrow on a <select class={input + ' ' + select}>. */
export const select =
  "appearance-none pr-9 bg-no-repeat bg-size-[5px_5px] bg-position-[calc(100%-18px)_50%,calc(100%-13px)_50%] bg-[linear-gradient(45deg,transparent_50%,var(--muted)_50%),linear-gradient(135deg,var(--muted)_50%,transparent_50%)]";

/** A label + box + hint group. */
export const field = 'mb-3.5 grid gap-1.5';
export const fieldLabel = 'text-[.88rem] font-semibold';
export const fieldHint = 'text-[.8rem] text-faint';

/** A checkbox row ("I agree to the Terms"). */
export const check = 'my-1 mb-[18px] flex cursor-pointer items-start gap-2.5 text-[.86rem] text-muted [&_input]:mt-[3px] [&_input]:size-4 [&_input]:shrink-0 [&_input]:accent-accent';

/** Small print under a form. */
export const fine = 'mt-[18px] text-center text-[.8rem] text-faint';
