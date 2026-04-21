import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Binary,
  Braces,
  ChartNoAxesCombined,
  ChevronRight,
  Cpu,
  Layers3,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow
} from 'lucide-react';

const fragmentCards = [
  {
    title: 'Two Sum',
    icon: Terminal,
    accent:
      'from-indigo-500/20 via-indigo-400/10 to-cyan-400/10 border-indigo-400/20 text-indigo-200',
    description:
      'Searches a numeric sequence for two values that combine into a target by maintaining a fast lookup structure during a single pass.',
    points: [
      'Validates variable declarations, map usage, loop structure, arithmetic expressions, indexing, and return payload construction.',
      'Exercises assignment chains, conditional checks, member access, and collection reads in one compact fragment.',
      'Useful for checking whether the analyzer correctly handles nested bracket access and state updates.'
    ]
  },
  {
    title: 'Valid Parentheses',
    icon: Braces,
    accent:
      'from-rose-500/20 via-rose-400/10 to-orange-400/10 border-rose-400/20 text-rose-200',
    description:
      'Verifies whether every opening bracket is matched by the correct closing bracket using a stack-driven control flow.',
    points: [
      'Stresses scope punctuation recognition across parentheses, braces, and brackets.',
      'Exercises nested conditionals, character comparison, stack operations, and early-return branches.',
      'Useful for verifying that the analyzer handles delimiters and control paths with precision.'
    ]
  },
  {
    title: 'Buy & Sell Stock',
    icon: ChartNoAxesCombined,
    accent:
      'from-cyan-500/20 via-sky-400/10 to-indigo-400/10 border-cyan-400/20 text-cyan-200',
    description:
      'Tracks the lowest observed price and the highest profit encountered so far during a forward scan of price data.',
    points: [
      'Validates dynamic state tracking, comparisons, arithmetic updates, and branch ordering.',
      'Exercises iterative processing, scalar state mutation, and profit recomputation logic.',
      'Useful for testing whether the analyzer can follow sequential decision-making without false positives.'
    ]
  }
];

const analyzerFeatures = [
  {
    icon: Binary,
    title: 'Lexical stream generation',
    text:
      'Source code is decomposed into a structured token sequence with line and column awareness for precise diagnostics.'
  },
  {
    icon: Workflow,
    title: 'Structural validation',
    text:
      'The parser inspects delimiters, operators, declarations, and control flow patterns against language-aware rules.'
  },
  {
    icon: ShieldCheck,
    title: 'Static risk surfacing',
    text:
      'The system can also flag selected runtime-risk patterns and semantic inconsistencies without executing the code.'
  }
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-6 pb-24 pt-10 md:px-10 md:pb-28 md:pt-14">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] px-6 py-10 shadow-[0_0_80px_rgba(15,23,42,0.45)] backdrop-blur-xl md:px-10 md:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(244,63,94,0.14),transparent_22%),radial-gradient(circle_at_60%_100%,rgba(56,189,248,0.12),transparent_25%)]" />
          <div className="absolute -left-20 top-10 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl animate-pulse" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200 shadow-[0_0_24px_rgba(99,102,241,0.12)]">
                <Sparkles size={14} className="text-rose-300" />
                Front-End Compiler Simulation
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
                A sharper and more human-centered
                <span className="block bg-gradient-to-r from-indigo-200 via-white to-rose-200 bg-clip-text text-transparent">
                  syntax analyzer interface
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                This project presents a lexical and syntax analysis environment for C++, PHP, and Python. It is designed to make tokenization, structural validation, and diagnostic output easier to understand while preserving a strong technical feel.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/environment"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500 to-indigo-600 px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_0_32px_rgba(99,102,241,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(99,102,241,0.35)]"
                >
                  Launch Environment
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-200 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                >
                  View Specifications
                  <ChevronRight size={18} />
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {analyzerFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-indigo-400/20 hover:bg-white/[0.06]"
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-200">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#071121] p-5 shadow-[0_0_60px_rgba(15,23,42,0.55)]">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Analyzer Preview
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#030712] p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <ScanLine size={16} className="text-indigo-300" />
                    Token and diagnostic workflow
                  </div>

                  <div className="space-y-3">
                    {[
                      'Input fragment selected',
                      'Lexical stream generated',
                      'Delimiter and operator checks applied',
                      'Semantic pass performed',
                      'Diagnostics rendered by severity'
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition-all duration-300 hover:bg-white/[0.06]"
                        style={{ animationDelay: `${index * 120}ms` }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-200">
                          0{index + 1}
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                    Default fragments are intentionally valid so the environment starts from a clean baseline before edits are introduced.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                <Cpu size={14} className="text-cyan-300" />
                Fragment Intelligence
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                Program fragments with clearer technical context
              </h2>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {fragmentCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_0_48px_rgba(15,23,42,0.4)]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-60`} />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />

                  <div className="relative">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white shadow-[0_0_24px_rgba(15,23,42,0.35)]">
                      <Icon size={28} />
                    </div>

                    <h3 className="text-2xl font-extrabold tracking-tight text-white">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{card.description}</p>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                      <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-200">
                        <Layers3 size={16} className="text-indigo-300" />
                        How it works
                      </div>

                      <ul className="space-y-3 text-sm leading-6 text-slate-400">
                        {card.points.map((point) => (
                          <li key={point} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                      Analyzer focus
                      <ChevronRight size={16} className="text-rose-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
