"use client";

import { ArrowRight, Check, Play, Users } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/app-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMe } from "@/hooks/useAuth";

export default function Home() {
  const { data: user } = useMe();

  return (
    <div className="min-h-screen bg-white text-[#14140a] selection:bg-[#c8f135] selection:text-[#403e0a]">
      {/* HEADER / NAV */}
      <header className="bg-[#403e0a] relative overflow-hidden px-6 pt-20 pb-22">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute left-[70%] top-[14%] w-[14px] h-[14px] bg-[#c8f135]" />
          <div className="absolute left-[74%] top-[8%] w-[8px] h-[8px] bg-[#a6e9ff]" />
          <div className="absolute left-[78%] top-[20%] w-[10px] h-[10px] bg-[#f5f1e0]" />
          <div className="absolute right-[-30px] top-[70px] w-[340px] h-[72px] rounded-full bg-[#b9a4f2] rotate-[-38deg]" />
          <div className="absolute right-[-30px] top-[150px] w-[340px] h-[72px] rounded-full bg-[#f5f1e0] rotate-[38deg]" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-[5px] rounded-full bg-[rgba(200,241,53,0.14)] text-[#c8f135] font-mono text-[13px] tracking-[0.06em] uppercase font-bold">
            <span className="w-[8px] h-[8px] rounded-full bg-[#c8f135] shrink-0"></span>
            Opticast · design system
          </div>
          <nav
            className="flex items-center justify-between mt-8 md:mt-0"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="size-10 bg-[#c8f135] rounded-6 flex items-center justify-center text-[#403e0a] shadow-sm transition-transform group-hover:rotate-12">
                <AppLogo width={24} height={24} className="object-contain" />
              </div>
              <span className="font-display font-black text-[clamp(24px,5vw,40px)] tracking-tight text-[#a6e9ff]">
                Opticast
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8 font-body text-sm text-[#f5f1e0]">
              <a
                href="#features"
                className="hover:text-[#c8f135] transition-colors"
              >
                Features
              </a>
              <a
                href="#workflow"
                className="hover:text-[#c8f135] transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="hover:text-[#c8f135] transition-colors"
              >
                Pricing
              </a>
              {user ? (
                <Link
                  href="/projects"
                  className="px-7 py-[13px] rounded-6 bg-[#c8f135] text-[#403e0a] font-display font-bold text-[17px] hover:opacity-90 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-display font-bold text-[#f5f1e0] hover:text-[#c8f135] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-7 py-[13px] rounded-6 bg-[#c8f135] text-[#403e0a] font-display font-bold text-[17px] hover:opacity-90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-32 pb-40 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-[5px] rounded-full bg-[rgba(200,241,53,0.14)] text-[#c8f135] font-mono text-[13px] tracking-[0.06em] uppercase font-bold mb-6">
            <span className="w-[8px] h-[8px] rounded-full bg-[#c8f135] shrink-0"></span>
            For YouTube creators who want a podcast without extra workflow
          </div>
          <h1 className="font-display font-black text-[clamp(44px,7vw,96px)] leading-[0.98] tracking-[-0.045em] text-[#a6e9ff] mb-6">
            Turn YouTube uploads into{" "}
            <span className="text-[#c8f135]">a Podcast.</span>
          </h1>
          <p className="text-[#14140a] text-[19px] leading-1.5 max-w-2xl mb-10 font-body">
            Auto audio cleanup, RSS hosting, and distribution for
            creator-approved channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center">
            {user ? (
              <Link
                href="/projects"
                className="px-7 py-[13px] rounded-6 bg-[#c8f135] text-[#403e0a] font-display font-bold text-[17px] flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
              >
                Open Your Dashboard <ArrowRight className="size-5" />
              </Link>
            ) : (
              <Link
                href="/signup"
                className="px-7 py-[13px] rounded-6 bg-[#c8f135] text-[#403e0a] font-display font-bold text-[17px] flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
              >
                Start Free — No Credit Card <ArrowRight className="size-5" />
              </Link>
            )}
            <Link
              href="#features"
              className="px-7 py-[13px] rounded-6 bg-[#f5f1e0] text-[#403e0a] font-display font-bold text-[17px] hover:bg-[#e7e4d6] transition-colors flex items-center justify-center gap-2"
            >
              See Key Benefits
            </Link>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display font-black text-[clamp(32px,4.5vw,56px)] tracking-[-0.04em] mb-10 text-[#14140a]">
            Built for creators who treat YouTube as the source of their podcast.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                src: "fal",
                title: "No second audio workflow",
                body: "Your videos become podcast-ready automatically, no separate export or audio editor required.",
              },
              {
                src: "Meetup",
                title: "Podcast hosting included",
                body: "We host audio, generate your feed, and keep your show available on Apple Podcasts, Spotify, and more.",
              },
              {
                src: "Both",
                title: "Creator-authorized only",
                body: "We process only channels you connect, keeping everything within YouTube’s terms and your ownership intact.",
              },
            ].map((item, i) => (
              <Card
                key={item.src}
                className="p-6 border border-[#e7e4d6] rounded-xl bg-white"
              >
                <CardHeader className="pb-0">
                  <span className="font-mono text-[12px] tracking-[0.06em] uppercase text-[#5a5a66] mb-2 block">
                    0{i + 1} · {item.src}
                  </span>
                  <CardTitle className="font-display font-black text-[20px] tracking-[-0.03em] text-[#14140a] mb-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[16px] leading-1.5 text-[#5a5a66] font-body mb-0">
                    {item.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="workflow" className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-display font-black text-[clamp(32px,4.5vw,56px)] tracking-[-0.04em] mb-10 text-[#14140a]">
            How It Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Connect Your Channel",
                body: "Sign in with Google and give Opticast permission to sync uploads from your channel.",
              },
              {
                icon: Play,
                title: "Auto-Extract & Clean",
                body: "We extract audio, remove noise, and normalize levels to broadcast-ready quality automatically.",
              },
              {
                icon: Check,
                title: "Publish Everywhere",
                body: "We host your episodes, generate an RSS feed, and submit metadata to directories so your show is available everywhere.",
              },
            ].map((step) => (
              <Card
                key={step.title}
                variant="elevated"
                className="p-6 rounded-16 bg-white border border-[#e7e4d6]"
              >
                <div className="size-12 rounded-full bg-[#c8f135]/10 text-[#403e0a] mb-4 flex items-center justify-center shrink-0">
                  <step.icon className="size-6" />
                </div>
                <CardTitle className="font-display font-bold text-[18px] text-[#14140a] mb-2">
                  {step.title}
                </CardTitle>
                <CardDescription>{step.body}</CardDescription>
              </Card>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display font-black text-[clamp(32px,4.5vw,56px)] tracking-[-0.04em] mb-3 text-[#14140a]">
              Plans that scale
            </h2>
            <p className="text-[14px] leading-1.4 text-[#5a5a66] font-body">
              Automatic podcast production for YouTube creators who want their
              video uploads to publish everywhere.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card
              variant="default"
              className="p-6 rounded-16 bg-white border border-[#e7e4d6]"
            >
              <CardHeader className="pb-2">
                <CardTitle className="font-display font-bold text-[20px] text-[#14140a]">
                  Free
                </CardTitle>
                <CardDescription>
                  Launch your first episodes and test the workflow with your
                  channel.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-display font-bold text-[20px] text-[#14140a] mb-6">
                  $0 / month
                </div>
                <Link
                  href="/projects/settings#billing"
                  className="inline-flex items-center gap-2 text-sm font-display font-bold text-[#5b3fd6] hover:underline"
                >
                  Start Free <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
            <Card variant="plan" className="border-b-[#b9a4f2] border-b-[5px]">
              <CardHeader className="pb-2">
                <CardTitle className="font-display font-bold text-[20px] text-[#14140a]">
                  Creator
                </CardTitle>
                <CardDescription>
                  Automatic RSS, advanced audio polish, and listener analytics
                  built for growth.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-display font-bold text-[20px] text-[#14140a] mb-6">
                  $19 / month
                </div>
                <Link
                  href="/projects/settings#billing"
                  className="inline-flex items-center gap-2 text-sm font-display font-bold text-[#5b3fd6] hover:underline"
                >
                  Choose Creator <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
            <Card
              variant="default"
              className="p-6 rounded-16 bg-white border border-[#e7e4d6]"
            >
              <CardHeader className="pb-2">
                <CardTitle className="font-display font-bold text-[20px] text-[#14140a]">
                  Agency
                </CardTitle>
                <CardDescription>
                  Multi-channel management, team seats, priority support
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="font-display font-bold text-[20px] text-[#14140a] mb-6">
                  Contact Us
                </div>
                <Link
                  href="/projects/settings#billing"
                  className="inline-flex items-center gap-2 text-sm font-display font-bold text-[#5b3fd6] hover:underline"
                >
                  Contact Sales <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mx-12 mt-24 mb-12 p-6 rounded-[32px] bg-[#1e1e2d] text-[#d6d6e0] text-[14px] flex flex-wrap gap-3 gap-y-2 justify-between items-center">
        <span className="font-display font-black text-[24px] tracking-[-0.04em] text-[#ffc2de]">
          Opticast
        </span>
        <span>Built with the Opttis design system · v1.0</span>
      </footer>
    </div>
  );
}
