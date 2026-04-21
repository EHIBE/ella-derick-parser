import {
  Activity,
  BadgeInfo,
  Binary,
  Braces,
  CheckCircle2,
  Code2,
  FileSearch,
  Orbit,
  Sparkles,
  Users
} from 'lucide-react';

const capabilities = [
  {
    icon: Binary,
    title: 'Lexical analysis',
    text:
      'Transforms raw source text into a structured token stream with line and column metadata for each unit.'
  },
  {
    icon: Braces,
    title: 'Syntax analysis',
    text:
      'Inspects grammatical structure, delimiter balance, operator placement, declarations, and control-flow forms.'
  },
  {
    icon: FileSearch,
    title: 'Diagnostic rendering',
    text:
      'Surfaces categorized findings such as lexical errors, syntax errors, semantic issues, runtime risks, and style warnings.'
  },
  {
    icon: Activity,
    title: 'Fragment validation',
    text:
      'Uses multiple algorithm fragments to test whether language-aware checks remain stable across different structures.'
  }
];

const objectives = [
  'Provide a usable front-end environment for experimenting with lexical and syntax analysis behavior.',
  'Show how equivalent logic fragments vary across C++, PHP, and Python while still being validated through one interface.',
  'Present diagnostics in a way that is readable enough for academic demonstration and technical evaluation.'
];

export default function About() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-10 md:px-10 md:pt-14">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_0_60px_rgba(15,23,42,0.4)] backdrop-blur-xl md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(244,63,94,0.10),transparent_22%)]" />

        <div className="relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-200">
            <BadgeInfo size={14} className="text-rose-300" />
            Project Specifications
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                A cleaner technical presentation of the compiler simulation project
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
                This system is a front-end simulation of lexical and syntax analysis for selected program fragments. It focuses on structured token generation, grammar validation, and readable diagnostics across C++, PHP, and Python.
              </p>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-200">
                  <Sparkles size={16} className="text-indigo-300" />
                  Core objectives
                </div>

                <ul className="space-y-4 text-sm leading-7 text-slate-300">
                  {objectives.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 size={18} className="mt-1 shrink-0 text-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#071121] p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-200">
                <Orbit size={16} className="text-cyan-300" />
                Scope of the system
              </div>

              <div className="space-y-4">
                {[
                  'Three supported language environments',
                  'Three core algorithm fragments',
                  'Token stream visualization',
                  'Categorized diagnostic output',
                  'Interactive fragment switching and editing'
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 font-bold text-indigo-200">
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            System capabilities
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            The project combines a visual interface with analyzer logic so the token stream and structural results remain visible during interaction.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <div
                key={capability.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.06]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-200">
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-extrabold tracking-tight text-white">
                  {capability.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{capability.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-16 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#07101f] to-[#030712]">
        <div className="grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">
              <Code2 size={18} className="text-rose-300" />
              Development team
            </div>
            <p className="max-w-3xl text-sm leading-7 text-slate-400">
              This presentation layer is intended for a polished academic demo while preserving the identity of the analyzer as a technical tool rather than a decorative landing page.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
              <Users size={18} className="text-indigo-300" />
              Team
            </div>
            <div className="space-y-2 text-sm leading-7 text-slate-300">
              <p className="text-lg font-bold text-white">Derick Xerxes A. Maquilang</p>
              <p>Ella Bianca A. Ruyeras</p>
              <p className="text-indigo-300">CS-EPC 323 • Machine Project</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
