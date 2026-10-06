import React from 'react';
import { Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Smart MCCB Pro
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a href="#overview" className="hover:text-slate-200 transition-colors">Technology</a>
            <a href="#simulator" className="hover:text-slate-200 transition-colors">Simulator</a>
            <a href="#failure-modes" className="hover:text-slate-200 transition-colors">Failure Modes</a>
            <a href="#fleet-monitor" className="hover:text-slate-200 transition-colors">Fleet SCADA</a>
            <a href="#roi-calculator" className="hover:text-slate-200 transition-colors">ROI Calculator</a>
            <a href="#contact" className="hover:text-slate-200 transition-colors">Request Pilot</a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span>© 2026 Smart MCCB Pro Systems Inc. All rights reserved.</span>
            <span>·</span>
            <span>Engineered for IEC 60947-2, UL 489, & IEEE 1458</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Security & Air-Gap Compliance</span>
            <span>Substation Safety Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
