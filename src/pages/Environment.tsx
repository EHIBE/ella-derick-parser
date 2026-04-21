import { useMemo, useState } from 'react';
import {
  Play,
  AlertTriangle,
  CheckCircle2,
  Code,
  TerminalSquare,
  Info,
  CircleAlert,
  Cpu,
  Sparkles,
  ScanSearch,
  Layers3
} from 'lucide-react';
import { fragments } from '../lib/fragments';
import { tokenize } from '../lib/lexer';
import type { Token } from '../lib/lexer';
import { parseTokens } from '../lib/parser';
import type { Diagnostic, Language, ParseResult } from '../lib/diagnostics';

type Fragment = 'twoSum' | 'validParentheses' | 'bestTime';

const fragmentDescriptions: Record<Fragment, string> = {
  twoSum:
    'Uses a lookup structure while scanning a sequence once to find two values that add to a target.',
  validParentheses:
    'Validates bracket matching through stack behavior, early exits, and repeated delimiter comparisons.',
  bestTime:
    'Tracks the minimum observed value and maximum profit during a single forward pass over data.'
};

const languageDescriptions: Record<Language, string> = {
  cpp: 'C++ mode emphasizes template syntax, explicit types, braces, and semicolon-based statements.',
  php: 'PHP mode emphasizes variable prefixes, language tags, array syntax, and dynamic data access patterns.',
  python: 'Python mode emphasizes indentation, colon-terminated blocks, and line-sensitive structure.'
};

export default function Environment() {
  const [lang, setLang] = useState<Language>('cpp');
  const [frag, setFrag] = useState<Fragment>('twoSum');
  const [code, setCode] = useState<string>(fragments.cpp.twoSum);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);

  const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLang = event.target.value as Language;
    setLang(nextLang);
    setCode(fragments[nextLang][frag]);
    setResult(null);
    setTokens([]);
  };

  const handleFragChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextFrag = event.target.value as Fragment;
    setFrag(nextFrag);
    setCode(fragments[lang][nextFrag]);
    setResult(null);
    setTokens([]);
  };

  const handleRun = () => {
    const lexResult = tokenize(code, lang);
    setTokens(lexResult.tokens);

    const parseResult = parseTokens(lexResult.tokens, lang, lexResult.diagnostics);
    setResult(parseResult);
  };

  const summary = useMemo(() => {
    if (!result) {
      return {
        errors: 0,
        warnings: 0,
        infos: 0
      };
    }

    return result.diagnostics.reduce(
      (accumulator, diagnostic) => {
        if (diagnostic.severity === 'error') {
          accumulator.errors++;
          return accumulator;
        }

        if (diagnostic.severity === 'warning') {
          accumulator.warnings++;
          return accumulator;
        }

        accumulator.infos++;
        return accumulator;
      },
      {
        errors: 0,
        warnings: 0,
        infos: 0
      }
    );
  }, [result]);

  const filteredTokens = tokens.filter((token) => token.type !== 'Newline');

  return (
    <div className="mx-auto w-full max-w-[1700px] px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 md:px-8 md:pt-8">
      <div className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:rounded-[28px] sm:p-6 md:rounded-[30px] md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200 sm:text-xs sm:tracking-[0.22em]">
            <Cpu size={14} className="text-rose-300" />
            Analysis Environment
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
            Interactive lexical and syntax workspace
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Edit a default valid fragment, switch languages, run the analyzer, and inspect the generated diagnostic set together with the lexical stream.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-200 sm:tracking-[0.18em]">
                <Sparkles size={15} className="text-indigo-300" />
                Selected fragment
              </div>
              <p className="text-sm leading-7 text-slate-400">{fragmentDescriptions[frag]}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-200 sm:tracking-[0.18em]">
                <ScanSearch size={15} className="text-cyan-300" />
                Language profile
              </div>
              <p className="text-sm leading-7 text-slate-400">{languageDescriptions[lang]}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#071121] p-5 shadow-[0_0_40px_rgba(15,23,42,0.35)] sm:rounded-[28px] sm:p-6 md:rounded-[30px] md:p-8">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-200 sm:tracking-[0.18em]">
            <Layers3 size={16} className="text-indigo-300" />
            Analyzer flow
          </div>

          <div className="space-y-3">
            {[
              'Choose a language and a fragment.',
              'The editor loads a valid default reference fragment.',
              'Run the analyzer to generate tokens.',
              'The parser evaluates structural and semantic rules.',
              'Diagnostics are grouped by severity and displayed with location data.'
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 transition-all duration-300 hover:bg-white/[0.06]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 font-bold text-indigo-200">
                  {index + 1}
                </div>
                <span className="leading-6">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#081020] shadow-[0_0_50px_rgba(15,23,42,0.45)] sm:rounded-[28px] md:rounded-[30px]">
          <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-sm font-bold text-indigo-200">
                <Code size={18} />
                Source Editor
              </div>

              <select
                className="w-full rounded-xl border border-white/10 bg-[#0b1730] px-4 py-3 text-sm font-medium text-slate-200 outline-none transition-all focus:border-indigo-400/30 focus:ring-2 focus:ring-indigo-400/20 sm:w-auto sm:min-w-[140px] sm:py-2.5"
                value={lang}
                onChange={handleLangChange}
              >
                <option value="cpp">C++</option>
                <option value="php">PHP</option>
                <option value="python">Python</option>
              </select>

              <select
                className="w-full rounded-xl border border-white/10 bg-[#0b1730] px-4 py-3 text-sm font-medium text-slate-200 outline-none transition-all focus:border-indigo-400/30 focus:ring-2 focus:ring-indigo-400/20 sm:w-auto sm:min-w-[220px] sm:py-2.5"
                value={frag}
                onChange={handleFragChange}
              >
                <option value="twoSum">Two Sum</option>
                <option value="validParentheses">Valid Parentheses</option>
                <option value="bestTime">Buy &amp; Sell Stock</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleRun}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(244,63,94,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_34px_rgba(244,63,94,0.34)] sm:w-auto sm:self-start sm:py-2.5 sm:text-sm sm:tracking-[0.18em]"
            >
              <Play size={16} className="fill-current transition-transform duration-300 group-hover:scale-110" />
              Run Parser
            </button>
          </div>

          <textarea
            className="min-h-[420px] w-full resize-none bg-[#050b16] p-4 font-mono text-xs leading-6 text-slate-100 outline-none selection:bg-indigo-500/30 focus:ring-2 focus:ring-inset focus:ring-indigo-400/20 sm:min-h-[520px] sm:p-5 sm:text-sm sm:leading-7 md:min-h-[640px] md:p-6"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#081020] shadow-[0_0_50px_rgba(15,23,42,0.45)] sm:rounded-[28px] md:rounded-[30px]">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] p-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-300 sm:tracking-[0.18em] md:p-5">
            <TerminalSquare size={18} className="text-indigo-300" />
            Output and Token Stream
          </div>

          <div className="max-h-[820px] space-y-6 overflow-y-auto p-4 sm:p-5 md:p-6">
            {!result && (
              <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-black/20 p-6 text-center text-sm leading-7 text-slate-500 sm:min-h-[400px] sm:p-8 md:min-h-[500px]">
                Select a fragment, review the default valid code, then run the analyzer to generate diagnostics and token output.
              </div>
            )}

            {result && (
              <>
                <div
                  className={`rounded-[24px] border p-4 shadow-[0_0_30px_rgba(15,23,42,0.28)] sm:p-5 ${
                    result.valid
                      ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-400/20 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  <div className="mb-3 flex items-start gap-3 text-lg font-black tracking-tight">
                    {result.valid ? (
                      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={24} />
                    ) : (
                      <AlertTriangle className="mt-0.5 shrink-0 text-rose-300" size={24} />
                    )}
                    <span>{result.valid ? 'Static Analysis Passed' : 'Static Analysis Failed'}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-rose-400/15 bg-black/20 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-rose-100">
                        Errors
                      </div>
                      <div className="mt-2 text-2xl font-black text-white">{summary.errors}</div>
                    </div>
                    <div className="rounded-2xl border border-amber-400/15 bg-black/20 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
                        Warnings
                      </div>
                      <div className="mt-2 text-2xl font-black text-white">{summary.warnings}</div>
                    </div>
                    <div className="rounded-2xl border border-sky-400/15 bg-black/20 p-4">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-100">
                        Info
                      </div>
                      <div className="mt-2 text-2xl font-black text-white">{summary.infos}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                  <h4 className="mb-4 border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-xs sm:tracking-[0.22em]">
                    Diagnostics
                  </h4>

                  {result.diagnostics.length === 0 && (
                    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                      No diagnostics produced.
                    </div>
                  )}

                  <div className="space-y-3">
                    {result.diagnostics.map((diagnostic: Diagnostic, index: number) => {
                      const isError = diagnostic.severity === 'error';
                      const isWarning = diagnostic.severity === 'warning';

                      return (
                        <div
                          key={`${diagnostic.line}-${diagnostic.column}-${index}`}
                          className={`rounded-2xl border p-4 transition-all duration-300 hover:bg-white/[0.03] ${
                            isError
                              ? 'border-rose-400/15 bg-rose-500/10 text-rose-200'
                              : isWarning
                                ? 'border-amber-400/15 bg-amber-500/10 text-amber-200'
                                : 'border-sky-400/15 bg-sky-500/10 text-sky-200'
                          }`}
                        >
                          <div className="mb-1 flex items-start gap-2 font-bold">
                            {isError ? (
                              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            ) : isWarning ? (
                              <CircleAlert size={16} className="mt-0.5 shrink-0" />
                            ) : (
                              <Info size={16} className="mt-0.5 shrink-0" />
                            )}
                            <span>{diagnostic.category}</span>
                          </div>

                          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] opacity-80 sm:text-xs sm:tracking-[0.16em]">
                            Line {diagnostic.line}, Column {diagnostic.column}
                          </div>

                          <div className="break-words text-sm leading-7">{diagnostic.message}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {filteredTokens.length > 0 && (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <h4 className="mb-4 border-b border-white/10 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-xs sm:tracking-[0.22em]">
                  Lexical Stream Analysis
                </h4>

                <div className="flex flex-wrap gap-2.5">
                  {filteredTokens.map((token, index) => (
                    <div
                      key={`${token.line}-${token.column}-${index}`}
                      className="min-w-0 max-w-full rounded-xl border border-white/10 bg-[#0a1528] px-3 py-2 text-xs shadow-[0_0_20px_rgba(15,23,42,0.18)] transition-all duration-300 hover:border-indigo-400/20 hover:bg-[#0d1b34]"
                    >
                      <div className="flex flex-wrap items-center gap-2 break-all">
                        <span className="font-semibold text-indigo-200">{token.type}</span>
                        <span className="text-slate-600">|</span>
                        <span className="font-medium text-rose-200 break-all">"{token.value}"</span>
                      </div>
                      <div className="mt-1 text-slate-500">
                        @{token.line}:{token.column}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
