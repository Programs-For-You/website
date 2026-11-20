import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge our custom type sizes, radii and shadows so it doesn't mistake `text-mono` for a colour.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'heading', 'subheading', 'title', 'lead', 'body', 'mono'] }],
      rounded: [{ rounded: ['card-sm', 'card', 'card-lg', 'sheet'] }],
      shadow: [{ shadow: ['soft', 'lift'] }]
    }
  }
});

/** Joins class names and lets the last Tailwind class win (so a page can override a component's padding, etc.). */
export const cn = (...inputs) => twMerge(clsx(inputs));
