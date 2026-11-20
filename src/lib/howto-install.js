// Steps for the install guide, used for HowTo structured data (kept in step with src/routes/install/+page.svelte).
export const MAC_STEPS = [
  {
    "name": "Type your email and download",
    "text": "Go to Downloads , type your email (no password needed), and click Download next to the app you want."
  },
  {
    "name": "Open the download",
    "text": "Open your Downloads folder (in Finder, or click the download arrow in your browser). Double-click the .zip file and it turns into the app."
  },
  {
    "name": "Move it to Applications",
    "text": "Drag the app into the Applications folder in Finder’s sidebar. Keeping it there means it works properly and updates cleanly."
  },
  {
    "name": "Open it, then click Done",
    "text": "Double-click the app. Your Mac shows a message saying it couldn’t check the app. Click Done . Don’t click Move to Trash."
  },
  {
    "name": "Allow it in System Settings",
    "text": "Open the Apple menu → System Settings → Privacy & Security . Scroll down to Security . Next to the message about the app, click Open Anyway . Type your Mac password, then click Open Anyway one more time. Tip: the Open Anyway button only shows for about an hour after you try to open the app. If it’s gone, double-click the app again, then come back here. On macOS 14 Sonoma there’s a shortcut: in App"
  },
  {
    "name": "Find the button at the top of your screen",
    "text": "Look in the top-right of your screen for the app’s new button. Click it to get started. Each app page has instructions: School Schedule · Email Assistant · Screen Assistant ."
  }
];
export const WINDOWS_STEPS = [
  {
    "name": "Download the Setup file",
    "text": "Go to Downloads and type your email. Next to School Schedule, check the box to agree to Owen Wang’s Terms of Service (the Windows version is his app), then click Windows Download . You’ll get SchoolSchedule-Windows-1.1.0-Setup.exe (34.7 MB). If your browser says the file isn’t commonly downloaded , choose Keep . In Microsoft Edge, point at the download, click ••• and choose Keep , then Show more a"
  },
  {
    "name": "Open the Setup file",
    "text": "Click the file in your browser’s download list. Or open File Explorer , click Downloads , and double-click the file."
  },
  {
    "name": "Click More info, then Run anyway",
    "text": "Windows shows a blue box that says “Windows protected your PC.” Don’t click Don’t run. Click More info , and a Run anyway button appears. Click it."
  },
  {
    "name": "Let it make changes",
    "text": "If Windows asks “Do you want to allow this app from an unknown publisher to make changes to your device?” , click Yes . If the installer asks who to install it for, choose Install for me only . Asked for an administrator password you don’t have? That happens on school and work computers, and only the people who manage the computer can type it."
  },
  {
    "name": "Click through the installer",
    "text": "Click Next on each page. The choices it already picked are fine. On the Select Additional Tasks page, you can tick two extras: Create a desktop shortcut puts an icon on your desktop. Create a shortcut to launch the app on computer startup opens it by itself every time you turn on your computer. We recommend it. Then click Install , and Finish when it’s done."
  },
  {
    "name": "Open it from the Start menu",
    "text": "Click Start , type School Schedule , and open WHS School Schedule Manager . Its bar shows up in the bottom-left corner of your screen, just above the taskbar, with your class, how far through it you are, the time left, and your next class. Its icon also sits by the clock (click the ^ arrow if you don’t see it). Right-click the icon to show, hide, or quit the app."
  },
  {
    "name": "Fix the calendar (one time)",
    "text": "The Windows version thinks November 19, 20, 23 and 24 are short days, but those are only for grades K-8. This code fixes it. In School Schedule Manager, click Settings , then Edit Yearly Info . Paste this code where it says “Paste import code here,” then click Save and Close :"
  }
];
