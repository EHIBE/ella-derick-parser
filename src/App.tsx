import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Environment from './pages/Environment';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen w-full overflow-x-hidden bg-[#050816] font-sans text-slate-100">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(244,63,94,0.10),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.08),transparent_26%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>

        <div className="relative z-10 flex min-h-screen w-full flex-col">
          <ScrollToTop />
          <Navbar />

          <main className="w-full flex-1 pt-[73px] sm:pt-[77px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/environment" element={<Environment />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}
