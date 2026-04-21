import { Link, useLocation } from 'react-router-dom';
import { Code2, Sparkles } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: '/', label: 'HOME' },
    { to: '/about', label: 'ABOUT' },
    { to: '/environment', label: 'ENVIRONMENT' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#040712]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-[1600px] items-center justify-between px-6 md:px-10">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.12)] transition-transform duration-300 group-hover:scale-105">
            <Code2 size={22} className="text-indigo-300" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/10 to-rose-400/10" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-rose-200 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              Syntax Analyzer
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">
              CS-EPC 323
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {links.map((link) => {
            const active = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold tracking-[0.22em] transition-all duration-300 md:text-sm ${
                  active
                    ? 'border border-indigo-400/25 bg-white/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.18)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="ml-1 hidden items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.12)] md:flex">
            <Sparkles size={14} />
            Analyzer Ready
          </div>
        </div>
      </div>
    </nav>
  );
}
