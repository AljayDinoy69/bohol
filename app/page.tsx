import Image from "next/image";
import HomeMapPanel from "./components/HomeMapPanel";
import GetStartedWithLogin from "./components/GetStartedWithLogin";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <div className="theme-scope relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#3B82F6]/20 blur-[90px]" />
        <div className="absolute -right-56 -bottom-56 h-[680px] w-[680px] rounded-full bg-[#22C55E]/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_20%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(900px_500px_at_80%_30%,rgba(34,197,94,0.08),transparent_60%)]" />
      </div>

      <main className="relative isolate mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-10">
        <header className="relative z-50 flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl md:px-8">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  <Image src="/wifi.jpg" alt="Bohol" fill className="object-cover" priority />
                </div>
                <div className="text-sm font-semibold tracking-wide text-white/90">
                  Bohol Signal Map
                </div>
              </div>

              <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
                <div className="relative group">
                  <a href="#" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    About
                    <span className="text-white/50 transition-colors group-hover:text-white">▾</span>
                  </a>
                  <div className="pointer-events-none absolute left-1/2 top-full z-[9999] w-[520px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-white/50">About</div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                        <div className="text-sm font-semibold text-white/90">Bohol Signal Map</div>
                        <div className="mt-1 text-xs leading-5 text-white/60">
                          A monitoring dashboard that visualizes signal status across key areas of Bohol for faster
                          situational awareness.
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <a href="#" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                          <div className="text-sm font-semibold text-white/90">Mission</div>
                          <div className="mt-0.5 text-xs leading-5 text-white/60">
                            Improve coverage visibility and response.
                          </div>
                        </a>
                        <a href="#" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                          <div className="text-sm font-semibold text-white/90">Data Sources</div>
                          <div className="mt-0.5 text-xs leading-5 text-white/60">
                            Sites, sensors, and field reports.
                          </div>
                        </a>
                        <a href="#" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                          <div className="text-sm font-semibold text-white/90">Team</div>
                          <div className="mt-0.5 text-xs leading-5 text-white/60">
                            Built by the local monitoring group.
                          </div>
                        </a>
                        <a href="#" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                          <div className="text-sm font-semibold text-white/90">Changelog</div>
                          <div className="mt-0.5 text-xs leading-5 text-white/60">
                            Latest updates and fixes.
                          </div>
                        </a>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-xs text-white/45">Want to learn more?</span>
                        <a href="#" className="text-xs font-semibold text-white/80 transition-colors hover:text-white">
                          Read Overview
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <a href="#" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    Services
                    <span className="text-white/50 transition-colors group-hover:text-white">▾</span>
                  </a>
                  <div className="pointer-events-none absolute left-1/2 top-full z-[9999] w-[520px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-white/50">Services</div>
                      <div className="grid gap-2">
                        <a href="#" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                          <div className="text-sm font-semibold text-white/90">Signal Monitoring</div>
                          <div className="mt-0.5 text-xs leading-5 text-white/60">
                            Track active, warning, and inactive status across selected areas.
                          </div>
                        </a>
                        <a href="#" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                          <div className="text-sm font-semibold text-white/90">Site Analytics</div>
                          <div className="mt-0.5 text-xs leading-5 text-white/60">
                            View trends, uptime snapshots, and quick summaries per site.
                          </div>
                        </a>
                        <a href="#" className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                          <div className="text-sm font-semibold text-white/90">Coverage Reports</div>
                          <div className="mt-0.5 text-xs leading-5 text-white/60">
                            Export reports for municipalities and signal checkpoints.
                          </div>
                        </a>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <span className="text-xs text-white/45">Need a custom report?</span>
                        <a href="#" className="text-xs font-semibold text-white/80 transition-colors hover:text-white">
                          Request Access
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <a href="#" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    Contact
                    <span className="text-white/50 transition-colors group-hover:text-white">▾</span>
                  </a>
                  <div className="pointer-events-none absolute left-1/2 top-full z-[9999] w-[460px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                      <div className="mb-3 text-xs font-semibold tracking-wide text-white/50">Contact</div>
                      <div className="grid gap-3">
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                          <div className="text-xs text-white/50">Email</div>
                          <a href="#" className="mt-0.5 block text-sm font-semibold text-white/85 hover:text-white">
                            support@boholsignalmap.local
                          </a>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                          <div className="text-xs text-white/50">Phone</div>
                          <a href="#" className="mt-0.5 block text-sm font-semibold text-white/85 hover:text-white">
                            +63 900 000 0000
                          </a>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                          <div className="text-xs text-white/50">Office</div>
                          <div className="mt-0.5 text-sm font-semibold text-white/85">
                            Tagbilaran City, Bohol
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                        <div className="text-xs text-white/45">Social</div>
                        <div className="flex items-center gap-3">
                          <a href="#" className="text-xs font-semibold text-white/80 transition-colors hover:text-white">
                            Facebook
                          </a>
                          <a href="#" className="text-xs font-semibold text-white/80 transition-colors hover:text-white">
                            YouTube
                          </a>
                          <a href="#" className="text-xs font-semibold text-white/80 transition-colors hover:text-white">
                            Instagram
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              <div className="flex items-center gap-3">
                <ThemeToggle className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white" />
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Settings"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35.91-.221 1.392-1.233 1.065-2.573-.94-1.543.826-3.31 2.37-2.37.996.607 2.294.07 2.573-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <section className="relative z-0 mt-5 grid flex-1 gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-8">
              <div className="flex flex-col justify-center">
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Bohol Signal Map
                </h1>
                <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-white/65 sm:text-base">
                  Curated and intelligent signal location monitoring across key areas of Bohol.
                </p>
                <p className="mt-2 text-xs text-white/45 sm:text-sm">2023-10-23 14:30:45</p>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.16)]" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-300 shadow-[0_0_0_3px_rgba(253,224,71,0.14)]" />
                    <span>Unstable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_3px_rgba(244,63,94,0.14)]" />
                    <span>Unavailable</span>
                  </div>
                </div>

                <div className="mt-8">
                  <GetStartedWithLogin />
                </div>
              </div>

              <div className="relative">
                <HomeMapPanel />

                <div className="mt-5 flex items-center justify-end gap-3 text-white/60">
                  <a
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 17a5 5 0 100-10 5 5 0 000 10z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5h.01" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="YouTube"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 12s0-3.2-.4-4.6a2.7 2.7 0 00-1.9-1.9C18.3 5 12 5 12 5s-6.3 0-7.7.5a2.7 2.7 0 00-1.9 1.9C2 8.8 2 12 2 12s0 3.2.4 4.6a2.7 2.7 0 001.9 1.9C5.7 19 12 19 12 19s6.3 0 7.7-.5a2.7 2.7 0 001.9-1.9c.4-1.4.4-4.6.4-4.6z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 15l5-3-5-3v6z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Facebook"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 8h2V5h-2a4 4 0 00-4 4v3H9v3h2v6h3v-6h2.3l.7-3H14V9a1 1 0 011-1z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </section>
      </main>
    </div>
  );
}
