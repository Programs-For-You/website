<script>
  import Seo from '#lib/components/Seo.svelte';
  import Eyebrow from '#lib/components/Eyebrow.svelte';
  import Lead from '#lib/components/Lead.svelte';
  import Container from '#lib/components/Container.svelte';
  import Prose from '#lib/components/prose/Prose.svelte';
  import SummaryBox from '#lib/components/prose/SummaryBox.svelte';
  import { SITE } from '#lib/config.js';
</script>

<Seo title="Privacy Policy · Programs For You" description="How Programs For You handles your information on the website and in our Mac apps." />

<section class="pt-16 pb-7"><Container><Eyebrow>Legal</Eyebrow><h1>Privacy Policy</h1><Lead class="m-0">Effective November 20, 2026</Lead></Container></section>
<section class="pt-2 pb-18"><Container>
<Prose>
  <SummaryBox><p><b>The short version:</b> you don’t need an email, password, or account to download our apps. If you contact us or apply to join the team, we use what you send only for that. Your emails and screen stay on your Mac. We don’t sell your information, and we don’t use ads or tracking cookies. Our Services are for people 13 and older.</p></SummaryBox>

  <h2>Who we are</h2>
  <p>Programs For You (programsforyou.com) is an independent developer that makes free Mac apps. If you have questions about this policy, email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>

  <h2>What we collect on the website</h2>
  <ul>
    <li><strong>Downloads.</strong> You don’t give us any information to download our apps.</li>
    <li><strong>Support tickets.</strong> When you send a ticket on our Contact page, we save your name, your email address, what it’s about, and your summary, so we can help you and write back. Tickets are stored by our host, Cloudflare, and only we can see them.</li>
    <li><strong>How long we keep it.</strong> We keep support tickets and applications only as long as we need them to help you or review your application, and delete them when you ask.</li>
    <li><strong>Website logs.</strong> Like most websites, our hosting provider may keep standard logs, such as your IP address, browser type, and pages visited, for security and reliability.</li>
  </ul>
  <p><strong>Update checks.</strong> Only when you click Check for Updates, the app checks programsforyou.com for a newer version. That’s a normal web request: it doesn’t include your email, name, or anything from the app, though our host may log your IP address like any website visit.</p>
  <p>We don’t use advertising, analytics trackers, or tracking cookies. If you send a support ticket, your browser remembers the email you typed so you don’t have to type it again. That stays in your browser.</p>

  <h2>Children under 13</h2>
  <p>Our Services are for people 13 and older. We don’t knowingly collect personal information from children under 13. If you think a child under 13 has sent us information, email us and we’ll delete it.</p>

  <h2>Our Mac apps</h2>
  <h3>School Schedule</h3>
  <p>School Schedule: your classes, bell times, homework, events, and settings are saved on your Mac only. They aren’t sent to us. School Schedule doesn’t need you to sign in. If you choose to link your Schoology calendar, your private calendar link is saved on your Mac and used only to download your calendar directly from Schoology. It isn’t sent to us.</p>
  <h3>Email Assistant</h3>
  <ul>
    <li>The app connects straight from your Mac to your email provider (Gmail, iCloud, or Yahoo). Your emails don’t pass through our servers, and we never see them.</li>
    <li>Your app password is stored in your Mac’s Keychain.</li>
    <li>By default, emails are read and replies are written by the AI built into your Mac (Apple Intelligence), which runs on your Mac.</li>
    <li>If you choose to add your own Claude API key, the emails being summarized are sent to Anthropic and handled under Anthropic’s privacy policy. This is off unless you turn it on.</li>
    <li>The app never sends an email unless you press Send.</li>
    <li>It connects only to personal email accounts. It doesn’t connect to school or work accounts.</li>
    <li>On screen: when you click Read email, it takes one picture of the window you’re using, reads the words on your Mac, and doesn’t save the picture. If you added your own Claude API key, that picture is sent to Anthropic. Replies made with On screen are copied for you to paste; the app doesn’t send them.</li>
  </ul>
  <h3>TI-84 Evo games</h3>
  <p>Our calculator games run only on your calculator. They don’t collect or send any information.</p>
  <h3>Screen Assistant</h3>
  <ul>
    <li>It only looks at your screen when you open it (or click Look again). It never records video and doesn’t save pictures of your screen.</li>
    <li>By default, the words on your screen are read and answered by Apple Intelligence on your Mac. Nothing is sent to us.</li>
    <li>If you choose to add your own Claude API key, a picture of your screen and your questions are sent to Anthropic and handled under Anthropic’s privacy policy. This is off unless you turn it on.</li>
    <li>Your to-dos and settings are saved on your Mac only.</li>
  </ul>
  <h3>Job applications</h3>
  <p>If you apply to join the team, we collect what you type in the form: your name, email, grade, the department you want, your answers, and whether a parent or guardian knows you’re applying (if you’re under 18). Only the owners of Programs For You can see it, we use it only to look at your application, and we’ll delete it if you ask.</p>

  <h2>How we use your information</h2>
  <ul>
    <li>To answer you when you contact us.</li>
    <li>To keep the website secure and working.</li>
  </ul>

  <h2>Who we share it with</h2>
  <p>We don’t sell or rent your information. We share it only with the service providers that run the website (Cloudflare for hosting and for storing support tickets and job applications), or if the law requires it.</p>

  <h2>Your choices</h2>
  <ul>
    <li><strong>Delete what you sent us</strong> anytime: email us and we’ll delete your support tickets or application. We don’t keep an email list anymore. If you gave us your email before, email us and we’ll delete it.</li>
    <li><strong>Delete app data</strong> by deleting the app from your Mac. For Email Assistant, you can also remove your email account in the app’s Settings.</li>
  </ul>

  <h2>Security</h2>
  <p>We take reasonable steps to protect your information, like using secure connections (HTTPS) and trusted providers. No system is perfect, though, so we can’t promise total security.</p>

  <h2>Changes</h2>
  <p>If we change this policy, we’ll update the date at the top. For big changes, we’ll post a notice on the website.</p>

  <h2>Contact</h2>
  <p>Questions? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
</Prose>
</Container></section>
