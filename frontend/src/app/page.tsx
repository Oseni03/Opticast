"use client";

import Link from "next/link";
import { useMe } from "@/hooks/useAuth";

const LogoMark = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 40 40"
    aria-hidden="true"
    className="shrink-0"
  >
    <g transform="rotate(45 20 20)">
      <rect x="3" y="16" width="34" height="8" rx="4" fill="#b9a4f2" />
    </g>
    <g transform="rotate(-45 20 20)">
      <rect x="3" y="16" width="34" height="8" rx="4" fill="#f5f1e0" />
    </g>
  </svg>
);

const scatter = [
  { l: "8%", t: "72%", c: "#c8f135", w: "14px", h: "14px" },
  { l: "14%", t: "84%", c: "#a6e9ff", w: "10px", h: "10px" },
  { l: "22%", t: "92%", c: "#f5f1e0", w: "8px", h: "8px" },
  { l: "47%", t: "10%", c: "#c8f135", w: "12px", h: "12px" },
  { l: "51%", t: "6%", c: "#a6e9ff", w: "8px", h: "8px" },
  { l: "55%", t: "13%", c: "#f5f1e0", w: "10px", h: "10px" },
  { l: "93%", t: "86%", c: "#c8f135", w: "14px", h: "14px" },
  { l: "89%", t: "93%", c: "#a6e9ff", w: "10px", h: "10px" },
  { l: "96%", t: "79%", c: "#f5f1e0", w: "8px", h: "8px" },
];

const steps = [
  {
    n: "1",
    c: "#c8f135",
    offset: "0px",
    title: "Connect",
    body: "Authorize your YouTube channel with Google. Opttis only works on channels you connect.",
  },
  {
    n: "2",
    c: "#b9a4f2",
    offset: "32px",
    title: "Auto-extract",
    body: "Each new upload is detected automatically, then turned into audio, Shorts, a blog post and social posts.",
  },
  {
    n: "3",
    c: "#ffc2de",
    offset: "0px",
    title: "Approve",
    body: "Review every draft by email, Slack or Telegram. Approve, edit or reject.",
  },
  {
    n: "4",
    c: "#a6e9ff",
    offset: "32px",
    title: "Publish",
    body: "Approved content goes out to podcast apps, your blog platforms and your social accounts.",
  },
];

const features = [
  {
    title: "AI Audio Pro",
    body: "Podcast-quality episodes normalized to -16 LUFS, with hosting and an RSS feed included.",
    bg: "linear-gradient(135deg,#c8f135 0%,#a6e9ff 100%)",
    tilt: "-4deg",
    tile: "-16 LUFS",
  },
  {
    title: "Shorts",
    body: "Short vertical clips cut from your uploads, ready for your approval.",
    bg: "linear-gradient(135deg,#ffc2de 0%,#c8f135 100%)",
    tilt: "4deg",
    tile: "short, sharp",
  },
  {
    title: "Blog posts with images",
    body: "A written post and a matching image, sent to the blog platforms you connect.",
    bg: "linear-gradient(135deg,#b9a4f2 0%,#ffc2de 100%)",
    tilt: "-3deg",
    tile: "read it too",
  },
  {
    title: "Social posts",
    body: "Posts drafted for each social account you connect, published once you approve.",
    bg: "linear-gradient(135deg,#a6e9ff 0%,#b9a4f2 100%)",
    tilt: "4deg",
    tile: "post it",
  },
  {
    title: "Auto-Sync",
    body: "New uploads are picked up automatically, so there is no separate workflow to run.",
    bg: "linear-gradient(135deg,#c8f135 0%,#b9a4f2 100%)",
    tilt: "-4deg",
    tile: "always in sync",
  },
  {
    title: "Listener analytics",
    body: "Downloads, episode performance, listener locations and the apps they use.",
    bg: "linear-gradient(135deg,#ffc2de 0%,#a6e9ff 100%)",
    tilt: "3deg",
    tile: "who is listening",
  },
];

const channels = [
  { name: "Email", body: "Review and approve straight from your inbox." },
  { name: "Slack", body: "Approve drafts where your team already talks." },
  { name: "Telegram", body: "One tap from your phone, wherever you are." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    note: "Try Opttis on your own channel.",
    items: [
      "Connect your YouTube channel",
      "Podcast feed and hosting",
      "Approval by email",
      "[FREE PLAN LIMIT]",
    ],
    bg: "#ffffff",
    fg: "#14140a",
    sub: "#5a5a66",
    dot: "#403e0a",
    btnBg: "#1e1e2d",
    btnFg: "#ffffff",
    cta: "Start free",
  },
  {
    name: "Creator",
    price: "[PRICE]",
    note: "For creators publishing everywhere.",
    items: [
      "Podcast, Shorts, blog and social",
      "Email, Slack and Telegram approval",
      "Listener analytics",
      "[CREATOR PLAN LIMIT]",
    ],
    bg: "#403e0a",
    fg: "#f5f1e0",
    sub: "#d6d3b8",
    dot: "#c8f135",
    btnBg: "#c8f135",
    btnFg: "#403e0a",
    cta: "Choose Creator",
  },
  {
    name: "Agency",
    price: "[PRICE]",
    note: "For teams managing several channels.",
    items: [
      "Multi-channel management",
      "Everything in Creator",
      "Shared approvals",
      "[AGENCY PLAN LIMIT]",
    ],
    bg: "#ffffff",
    fg: "#14140a",
    sub: "#5a5a66",
    dot: "#403e0a",
    btnBg: "#1e1e2d",
    btnFg: "#ffffff",
    cta: "Choose Agency",
  },
];

export default function Home() {
  const { data: user } = useMe();
  const signedIn = !!user;
  const signedOut = !signedIn;

  return (
    <div
      id="top"
      className="min-h-screen bg-white text-[#14140a] selection:bg-[#c8f135] selection:text-[#403e0a]"
    >
      {/* HERO */}
      <section
        className="bg-[#403e0a] relative overflow-hidden"
        style={{ paddingTop: 0 }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          {scatter.map((d) => (
            <div
              key={`${d.l}-${d.t}`}
              className="absolute pointer-events-none"
              style={{
                left: d.l,
                top: d.t,
                width: d.w,
                height: d.h,
                background: d.c,
              }}
            />
          ))}
        </div>

        <header className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center gap-3 gap-x-8 relative z-3">
          <Link
            href="#top"
            aria-label="Opttis home"
            className="flex items-center gap-2 text-[#c8f135] text-decoration-none"
          >
            <LogoMark />
            <span className="font-display font-black text-[28px] tracking-[-0.04em]">
              opttis
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="flex flex-wrap gap-[2px] p-[4px] rounded-full bg-[rgba(245,241,224,0.12)]"
          >
            <Link
              href="#how"
              className="px-[18px] py-[12px] rounded-full text-[#f5f1e0] text-decoration-none text-[15px] font-medium"
            >
              How it works
            </Link>
            <Link
              href="#features"
              className="px-[18px] py-[12px] rounded-full text-[#f5f1e0] text-decoration-none text-[15px] font-medium"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="px-[18px] py-[12px] rounded-full text-[#f5f1e0] text-decoration-none text-[15px] font-medium"
            >
              Pricing
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {signedOut ? (
              <>
                <Link
                  href="/login"
                  className="px-[18px] py-[12px] text-[#f5f1e0] text-decoration-none text-[15px] font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-[22px] py-[12px] rounded-6 bg-[#c8f135] text-[#403e0a] text-decoration-none text-[15px] font-bold"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <Link
                href="/projects"
                className="px-[22px] py-[12px] rounded-6 bg-[#c8f135] text-[#403e0a] text-decoration-none text-[15px] font-bold"
              >
                Go to dashboard
              </Link>
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 pt-[40px] pb-[112px] flex flex-wrap items-center gap-[56px] relative z-2">
          <div className="flex-1 flex-1 [480px] min-w-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-[5px] rounded-full bg-[rgba(200,241,53,0.14)] text-[#c8f135] font-mono text-[13px] tracking-[0.06em] uppercase font-bold">
              <span className="w-[8px] h-[8px] rounded-full bg-[#c8f135] shrink-0"></span>
              Creator-authorized only
            </div>
            <h1 className="font-display font-black text-[clamp(42px,6.4vw,84px)] leading-[0.98] tracking-[-0.045em] text-[#a6e9ff] mb-6">
              One upload. Every format. You approve.
            </h1>
            <p className="text-[#f5f1e0] text-[19px] leading-1.5 max-w-[540px] mb-0 font-body">
              Connect your YouTube channel and Opttis turns each new video into
              a podcast episode, Shorts, a blog post and social posts. Nothing
              goes live until you say so.
            </p>
            <div className="flex flex-wrap gap-[12px] mt-[32px]">
              {signedOut ? (
                <Link
                  href="/signup"
                  className="px-7 py-[13px] rounded-6 bg-[#c8f135] text-[#403e0a] text-decoration-none font-display font-bold text-[17px]"
                >
                  Start free
                </Link>
              ) : (
                <Link
                  href="/projects"
                  className="px-7 py-[13px] rounded-6 bg-[#c8f135] text-[#403e0a] text-decoration-none font-display font-bold text-[17px]"
                >
                  Go to dashboard
                </Link>
              )}
              <Link
                href="#how"
                className="px-7 py-[13px] rounded-6 bg-[#f5f1e0] text-[#403e0a] text-decoration-none font-display font-bold text-[17px]"
              >
                See how it works
              </Link>
            </div>
            <div className="flex items-center gap-3 mt-[40px]">
              <svg
                width="72"
                height="40"
                viewBox="0 0 72 40"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 32 C 18 6, 44 4, 66 22"
                  stroke="#ffc2de"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M55 19 L67 23 L61 34"
                  stroke="#ffc2de"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="font-script font-bold text-[32px] text-[#ffc2de] inline-block rotate-[-3deg]">
                approve from your inbox!
              </span>
            </div>
          </div>

          {/* approval card visual */}
          <div className="flex-1 flex-1 [400px] min-w-0 relative min-h-[500px]">
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background:
                  "radial-gradient(circle at 28% 30%,#FF9ACB 0,rgba(255,154,203,0) 52%),radial-gradient(circle at 74% 72%,#C8F135 0,rgba(200,241,53,0) 48%),radial-gradient(circle at 70% 22%,#A6E9FF 0,rgba(166,233,255,0) 40%),#2B2A06",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute right-[-30px] top-[20px] w-[360px] h-[78px] rounded-full bg-[#b9a4f2] rotate-[-38deg]"
            />
            <div
              aria-hidden="true"
              className="absolute right-[-30px] top-[110px] w-[360px] h-[78px] rounded-full bg-[#f5f1e0] rotate-[38deg]"
            />
            <div className="absolute left-[-12px] top-[28px] rotate-[-6deg] inline-flex items-center gap-2 px-[16px] py-[8px] rounded-full bg-[#6d4ae0] text-white font-mono text-[13px] tracking-[0.06em] uppercase">
              <span className="w-[8px] h-[8px] rounded-full bg-[#c8f135]"></span>
              New upload
            </div>
            <div className="absolute left-[20px] right-[20px] bottom-[20px] px-[18px] rounded-[14px] bg-white shadow-[0_4px_18px_rgba(30,30,45,0.18)]">
              <p className="font-mono text-[12px] tracking-[0.06em] uppercase text-[#5a5a66] mb-0">
                4 drafts ready for review
              </p>
              <p className="font-display font-bold text-[18px] tracking-[-0.02em] text-[#14140a] mt-[4px] mb-[12px]">
                [Video title]
              </p>
              {[
                { name: "Podcast episode", color: "#c8f135" },
                { name: "Short", color: "#f65858" },
                { name: "Blog post + image", color: "#b9a4f2" },
                { name: "Social posts", color: "#a6e9ff" },
              ].map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-3 py-[9px] border-t border-[#e7e4d6] first:border-0"
                >
                  <span
                    className="w-[12px] h-[12px] rounded-[3px] shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="flex-1 min-w-0 font-bold text-[15px]">
                    {d.name}
                  </span>
                  <span className="px-3 py-[5px] rounded-full bg-[#1e1e2d] text-white text-[12px] font-bold">
                    Approve
                  </span>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-[12px] border-t border-[#e7e4d6] font-mono text-[12px] text-[#5a5a66]">
                <span>Sent to</span>
                <span className="text-[#14140a]">Email</span>
                <span className="text-[#14140a]">Slack</span>
                <span className="text-[#14140a]">Telegram</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="pt-[96px] pb-0 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 gap-x-[24px] mb-[48px]">
            <h2 className="font-display font-black text-[clamp(32px,4.5vw,56px)] tracking-[-0.04em] mb-0">
              How Opttis works
            </h2>
            <span className="font-script font-bold text-[34px] text-[#e0560f] inline-block rotate-[-4deg]">
              upload once!
            </span>
          </div>
          <div className="grid grid-cols-1 gap-[24px] items-start sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="p-[28px] rounded-xl bg-white shadow-[0_4px_18px_rgba(30,30,45,0.10)]"
                style={{ marginTop: s.offset }}
              >
                <span
                  className="flex items-center justify-center w-[48px] h-[48px] rounded-full font-display font-black text-[20px]"
                  style={{ background: s.c }}
                >
                  {s.n}
                </span>
                <h3 className="font-display font-bold text-[22px] tracking-[-0.02em] mt-[16px] mb-[8px]">
                  {s.title}
                </h3>
                <p className="text-[#5a5a66] text-[16px] leading-1.5 font-body mb-0">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="pt-[96px] pb-0 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display font-black text-[clamp(34px,5vw,64px)] tracking-[-0.04em] mb-[40px]">
            Everything from one video
          </h2>
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="p-[24px] border border-[#e7e4d6] rounded-xl bg-white flex flex-col gap-[18px]"
              >
                <div>
                  <h3 className="font-display font-bold text-[23px] tracking-[-0.03em] mb-[8px]">
                    {f.title}
                  </h3>
                  <p className="text-[#5a5a66] text-[16px] leading-1.5 font-body mb-0">
                    {f.body}
                  </p>
                </div>
                <div
                  className="h-[150px] rounded-12 flex items-center justify-center overflow-hidden px-[16px]"
                  style={{ background: f.bg }}
                >
                  <span
                    className="font-display font-black font-italic text-[34px] leading-1 tracking-[-0.04em] text-[#403e0a] block"
                    style={{ transform: f.tilt }}
                  >
                    {f.tile}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APPROVAL BAND */}
      <section className="mt-[96px] bg-[#0a0a0a] relative overflow-hidden pt-[96px] px-6 pb-[96px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute left-[86%] top-[8%] w-[14px] h-[14px] bg-[#a6e9ff]" />
          <div className="absolute left-[90%] top-[14%] w-[10px] h-[10px] bg-[#a6e9ff]" />
          <div className="absolute left-[94%] top-[6%] w-[8px] h-[8px] bg-[#f5f1e0]" />
          <div className="absolute left-[5%] top-[94%] w-[12px] h-[12px] bg-[#a6e9ff]" />
          <div className="absolute left-[9%] top-[90%] w-[8px] h-[8px] bg-[#c8f135]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <h2 className="font-display font-black text-[clamp(36px,5vw,64px)] leading-1 tracking-[-0.04em] text-[#f5f1e0] mb-0 max-w-[760px]">
            Nothing goes live without you.
          </h2>
          <p className="text-[#b4b4be] text-[18px] leading-1.5 max-w-[560px] mt-[20px] mb-0">
            Every draft reaches you where you already are. Approve, edit or
            reject in one tap.
          </p>
          <div className="mt-[48px] border-t border-[#2a2a2a]">
            {channels.map((c) => (
              <div
                key={c.name}
                className="flex flex-wrap items-center justify-between gap-3 gap-x-[32px] py-[28px] border-b border-[#2a2a2a]"
              >
                <h3 className="flex-1 flex-1 [280px] font-display font-bold text-[clamp(26px,3.4vw,40px)] tracking-[-0.03em] text-[#f5f1e0]">
                  {c.name}
                </h3>
                <p className="flex-1 flex-1 [280px] text-[#b4b4be] text-[16px] leading-1.5 mb-0">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pt-[96px] px-6 pb-[24px] bg-[#f5f1e0]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 gap-x-[24px] mb-[40px]">
            <h2 className="font-display font-black text-[clamp(32px,4.5vw,56px)] tracking-[-0.04em] mb-0">
              Plans that grow with you
            </h2>
            <span className="font-script font-bold text-[34px] text-[#e0560f] inline-block rotate-[-4deg]">
              start free!
            </span>
          </div>
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {plans.map((p) => (
              <article
                key={p.name}
                className="p-[32px] rounded-xl flex flex-col gap-[18px] shadow-[0_4px_18px_rgba(30,30,45,0.10)]"
                style={{
                  background: p.bg,
                  color: p.fg,
                }}
              >
                <span
                  className="font-mono text-[13px] tracking-[0.06em] uppercase"
                  style={{ color: p.sub }}
                >
                  {p.name}
                </span>
                <div className="font-display font-black text-[48px] leading-1 tracking-[-0.045em]">
                  {p.price}
                </div>
                <p
                  className="text-[16px] leading-1.5 mb-0"
                  style={{ color: p.sub }}
                >
                  {p.note}
                </p>
                <ul
                  className="m-0 p-0 list-none flex flex-col gap-[10px] text-[15px]"
                  style={{ color: p.sub }}
                >
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-[10px] items-flex-start">
                      <span
                        className="w-[8px] h-[8px] mt-[7px] shrink-0"
                        style={{ background: p.dot }}
                      />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-auto px-[24px] py-[16px] rounded-6 text-decoration-none text-center font-bold text-[16px]"
                  style={{ background: p.btnBg, color: p.btnFg }}
                >
                  {p.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-[96px] px-6 pb-[72px]">
        <div className="max-w-7xl mx-auto relative overflow-hidden pt-[72px] px-[40px] pb-[40px] rounded-[24px] bg-[#a6e9ff]">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute right-[6%] top-[18%] w-[14px] h-[14px] bg-[#403e0a]" />
            <div className="absolute right-[10%] top-[28%] w-[10px] h-[10px] bg-[#f5f1e0]" />
            <div className="absolute right-[-40px] bottom-[-30px] w-[300px] h-[64px] rounded-full bg-[#b9a4f2] rotate-[-38deg]" />
            <div className="absolute right-[-40px] bottom-[30px] w-[300px] h-[64px] rounded-full bg-[#f5f1e0] rotate-[38deg]" />
          </div>
          <div className="relative max-w-[620px]">
            <h2 className="font-display font-black text-[clamp(34px,5vw,64px)] leading-1 tracking-[-0.04em] text-[#403e0a] mb-0">
              Connect your channel. Keep the final say.
            </h2>
            <p className="text-[#2b2a06] text-[18px] leading-1.5 mt-[20px] mb-0">
              Free to start. Opttis only ever works on channels you authorize.
            </p>
            <div className="flex flex-wrap gap-[12px] mt-[32px]">
              {signedOut ? (
                <>
                  <Link
                    href="/signup"
                    className="px-[22px] py-[12px] rounded-full bg-[#1e1e2d] text-white text-decoration-none text-[17px] font-bold"
                  >
                    Sign up free
                  </Link>
                  <Link
                    href="/login"
                    className="px-[22px] py-[12px] rounded-full bg-white text-[#403e0a] text-decoration-none text-[17px] font-bold"
                  >
                    Log in
                  </Link>
                </>
              ) : (
                <Link
                  href="/projects"
                  className="px-[22px] py-[12px] rounded-full bg-[#1e1e2d] text-white text-decoration-none text-[17px] font-bold"
                >
                  Go to dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-[12px] mt-0 mb-[12px] px-[40px] pt-[56px] rounded-[32px] bg-[#1e1e2d] overflow-hidden text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-[20px]">
            <div className="flex items-center gap-2">
              <LogoMark />
              <span className="font-display font-black text-[24px] tracking-[-0.04em]">
                opttis.
                <span className="text-[#ffc2de]">Upload once</span>
              </span>
            </div>
            <nav
              aria-label="Footer"
              className="flex flex-wrap gap-3 gap-x-[28px] text-[15px]"
            >
              <Link href="#how" className="text-[#d6d6e0] text-decoration-none">
                How it works
              </Link>
              <Link
                href="#features"
                className="text-[#d6d6e0] text-decoration-none"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-[#d6d6e0] text-decoration-none"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="text-[#d6d6e0] text-decoration-none"
              >
                Log in
              </Link>
            </nav>
          </div>
          <div className="mt-[40px] flex flex-wrap gap-3 gap-x-[28px] text-[13px] text-[#b4b4c4]">
            <Link href="#top" className="text-[#b4b4c4] text-decoration-none">
              Terms
            </Link>
            <Link href="#top" className="text-[#b4b4c4] text-decoration-none">
              Privacy policy
            </Link>
            <span>© 2026 Opttis. All rights reserved.</span>
          </div>
          <div
            aria-hidden="true"
            className="mt-[32px] font-display font-black text-[clamp(72px,19vw,280px)] leading-[0.8] tracking-[-0.05em] text-[#ffc2de] whitespace-nowrap [margin-bottom:-0.12em]"
          >
            opttis
          </div>
        </div>
      </footer>
    </div>
  );
}
