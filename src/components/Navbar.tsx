import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Menu, Sparkles, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'ABOUT' },
    { to: '/environment', label: 'ENVIRONMENT' }
  ];

  const handleClose = (): void => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#040712]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 md:px-10">
        <Link to="/" className="group flex min-w-0 items-center gap-3" onClick={handleClose}>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.12)] transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
            <Code2 size={20} className="text-indigo-300 sm:size-[22px]" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/10 to-rose-400/10" />
          </div>

          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate bg-gradient-to-r from-white via-indigo-200 to-rose-200 bg-clip-text text-base font-extrabold tracking-tight text-transparent sm:text-lg">
              Syntax Analyzer
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400 sm:text-[11px] sm:tracking-[0.28em]">
              CS-EPC 323
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:gap-3 lg:flex">
          {links.map((link) => {
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold tracking-[0.18em] transition-all duration-300 md:text-sm md:tracking-[0.22em] ${
                  active
                    ? 'border border-indigo-400/25 bg-white/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.18)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="ml-1 hidden items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.12)] xl:flex">
            <Sparkles size={14} />
            Analyzer Ready
          </div>
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsOpen((previousState) => !previousState)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#050816]/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2">
            {links.map((link) => {
              const active = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleClose}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold tracking-[0.18em] transition-all duration-300 ${
                    active
                      ? 'border border-indigo-400/25 bg-white/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.18)]'
                      : 'border border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.12)]">
              <Sparkles size={16} />
              Analyzer Ready
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
