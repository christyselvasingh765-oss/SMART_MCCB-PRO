import React, { useState } from 'react';
import { FAILURE_MODES_CATALOG } from '../data/mockBreakers';
import { ShieldAlert, AlertTriangle, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

export const FailureModes: React.FC = () => {
  const [selectedModeId, setSelectedModeId] = useState<string>('fm-1');

  const activeMode = FAILURE_MODES_CATALOG.find((m) => m.id === selectedModeId) || FAILURE_MODES_CATALOG[0];

  return (
    <section id="failure-modes" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            Physics of Failure & Root Cause Modeling
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The 6 Primary Failure Modes in Industrial MCCBs
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Conventional trip units are passive: they wait for fault current to heat a bimetal strip or trigger a magnetic coil. By the time a catastrophic trip occurs, equipment damage or arc flash has already ensued. Smart MCCB Pro continuously diagnoses degradation before mechanical failure occurs.
          </p>
        </div>

        {/* Two-Column Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Failure Modes Selector List */}
          <div className="lg:col-span-5 space-y-2.5">
            {FAILURE_MODES_CATALOG.map((mode) => {
              const isSelected = mode.id === selectedModeId;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedModeId(mode.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-950/40 text-white'
                      : 'bg-slate-900/40 border-slate-850 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-white">{mode.title}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        mode.riskSeverity === 'Critical'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {mode.riskSeverity}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-slate-400">
                    <span>Subsystem: {mode.subsystem}</span>
                    <span className="font-mono text-cyan-400">+{mode.leadTimeHours}h lead time</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: In-Depth Engineering Dossier & Comparison */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Degradation Dossier
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {activeMode.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Standard Baseline</div>
                  <div className="text-xs font-mono font-semibold text-slate-200">
                    {activeMode.standardReference}
                  </div>
                </div>
              </div>

              {/* Physical Root Cause */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Physical Mechanism of Degradation
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                  {activeMode.physicalCause}
                </p>
              </div>

              {/* Head-to-Head Comparison: Conventional vs Smart MCCB Pro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Conventional Trip Unit */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-950/60">
                  <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-2">
                    <XCircle className="w-4 h-4 shrink-0" />
                    Conventional Breaker Approach
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {activeMode.conventionalDetection}
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-rose-400/80">
                    Lead time: 0 hours (trips after damage)
                  </div>
                </div>

                {/* Smart MCCB Pro */}
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Smart MCCB Pro Prognosis
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeMode.smartMccbProDetection}
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-cyan-400 font-semibold">
                    Lead time: Up to {activeMode.leadTimeHours} hours advance notice
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Engineering Spotlight with Thermography Asset */}
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 relative">
              <div className="aspect-[16/9] max-h-56 w-full relative">
                <img
                  src="/src/assets/images/thermal_telemetry_analysis_1791267994852.jpg"
                  alt="Thermal diagnostic telemetry showing circuit breaker hot spot analysis"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs font-semibold text-cyan-400">
                    Optical & Thermal Infrared Array
                  </div>
                  <div className="text-xs text-slate-200 mt-0.5">
                    Continuous ΔT differential measurement isolates true terminal looseness from ambient seasonal fluctuations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
