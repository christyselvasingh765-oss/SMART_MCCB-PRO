import React from 'react';
import { Activity, Download, Play } from 'lucide-react';

interface NavbarProps {
  onOpenSimulator: () => void;
  onOpenSpecDownload: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulator,
  onOpenSpecDownload,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand title, one line wordmark */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/60 transition-colors">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            Smart MCCB Pro
          </span>
        </a>

        {/* Zone 2: 4-6 nav links, single-line clean text */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#overview" className="hover:text-cyan-400 transition-colors">
            Technology
          </a>
          <a href="#simulator" className="hover:text-cyan-400 transition-colors">
            Breaker Simulator
          </a>
          <a href="#failure-modes" className="hover:text-cyan-400 transition-colors">
            Failure Modes
          </a>
          <a href="#fleet-monitor" className="hover:text-cyan-400 transition-colors">
            Fleet SCADA
          </a>
          <a href="#roi-calculator" className="hover:text-cyan-400 transition-colors">
            ROI Model
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSpecDownload}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Tech Spec</span>
          </button>
          <button
            onClick={onOpenSimulator}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
