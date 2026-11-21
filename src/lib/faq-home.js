// Question and answer text for the home page FAQ (plain text, no links). Used for FAQPage structured data.
// Keep in step with the <FaqItem> list in src/routes/+page.svelte.
export const HOME_FAQ = [
  { q: "Is there a Windows version?", a: "Not yet. Windows versions are coming soon." },
  { q: "I need help. Who do I contact?", a: "Call (475) 266-1457 or email bradykrupa@programsforyou.com. The install guide also answers the most common questions." },
  { q: "How do I get updates?", a: "Automatically. Our apps update themselves in the background and install new versions when you step away from your computer, so you never have to download them again. Before an update installs, the app checks that it really comes from us, and you can turn automatic updates off in each app’s Settings. More help." },
  { q: "Is it really free?", a: "Yes. The apps are free to download and use, and you don’t need an email or an account." },
  { q: "Why does my Mac say it can’t check the app?", a: "Our apps aren’t registered with Apple’s paid developer program yet, so macOS asks you to approve them once. The install guide shows exactly what to click." },
  { q: "What computers do they work on?", a: "Email Assistant and Screen Assistant need macOS 26 Tahoe or newer on a Mac with Apple silicon (M1 or later). School Schedule and the Windows versions are coming soon." },
  { q: "Does the Email Assistant send my emails to a server?", a: "No. It connects straight from your Mac to your email and uses the AI built into your Mac. If you choose to add your own Claude API key, the emails being summarized go to Anthropic instead." },
  { q: "Does Screen Assistant watch everything I do?", a: "No. It only looks at your screen when you open it, it never records video, and it doesn’t save pictures. With Apple Intelligence, what it sees stays on your Mac." },
  { q: "Will it ever send an email without asking me?", a: "Never. Every reply waits for you to press Preview & Send." },
  { q: "Is this made by Apple?", a: "No. Programs For You is an independent developer and isn’t affiliated with Apple." },
];
