import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Thermometer,
  Zap,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { BreakerTelemetry, FailureScenarioId } from '../types/breaker';
import { INITIAL_BREAKERS, FAILURE_SCENARIOS } from '../data/mockBreakers';

interface SimulatorProps {
  onOpenAiPrognosis: (breaker: BreakerTelemetry, scenarioId: FailureScenarioId) => void;
}

export const Simulator: React.FC<SimulatorProps> = ({ onOpenAiPrognosis }) => {
  const [selectedBreakerId, setSelectedBreakerId] = useState<string>('brk-101');
  const [selectedScenarioId, setSelectedScenarioId] = useState<FailureScenarioId>('terminal_hotspot');
  const [loadPercent, setLoadPercent] = useState<number>(85); // 50% to 125%

  const baseBreaker = useMemo(() => {
    return INITIAL_BREAKERS.find((b) => b.id === selectedBreakerId) || INITIAL_BREAKERS[0];
  }, [selectedBreakerId]);

  const activeScenario = useMemo(() => {
    return FAILURE_SCENARIOS.find((s) => s.id === selectedScenarioId) || FAILURE_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Derive dynamic telemetry combining load slider & scenario overrides
  const telemetry = useMemo(() => {
    const ov = activeScenario.telemetryOverrides;
    const loadFactor = loadPercent / 100;

    const basePhaseL1Curr = Math.round(baseBreaker.ratedCurrent * 0.75 * loadFactor);
    const basePhaseL2Curr = Math.round(baseBreaker.ratedCurrent * 0.77 * loadFactor);
    const basePhaseL3Curr = Math.round(baseBreaker.ratedCurrent * 0.74 * loadFactor);

    // Dynamic temperature scaled by I²R
    const heatMultiplier = Math.pow(loadFactor, 1.6);

    const termL1 = Math.round((baseBreaker.terminalTemperatures.loadL1 * heatMultiplier) * 10) / 10;
    const termL2 = ov.terminalHotspotLoadL2
      ? Math.round((ov.terminalHotspotLoadL2 * (0.8 + 0.2 * loadFactor)) * 10) / 10
      : Math.round((baseBreaker.terminalTemperatures.loadL2 * heatMultiplier) * 10) / 10;
    const termL3 = Math.round((baseBreaker.terminalTemperatures.loadL3 * heatMultiplier) * 10) / 10;

    const resL2 = ov.phaseL2Resistance ?? baseBreaker.phases.L2.contactResistance;
    const contactWear = ov.contactWearPercent ?? baseBreaker.contactWearPercent;
    const latchMs = ov.latchReleaseTimeMs ?? baseBreaker.latchReleaseTimeMs;
    const arcIndex = ov.arcChuteHealthIndex ?? baseBreaker.arcChuteHealthIndex;
    const leakageUa = ov.dielectricLeakageCurrentUa ?? baseBreaker.dielectricLeakageCurrentUa;
    const thdVal = ov.thdCurrentPercent ?? baseBreaker.thdCurrentPercent;

    return {
      currents: { L1: basePhaseL1Curr, L2: basePhaseL2Curr, L3: basePhaseL3Curr },
      temperatures: {
        lineL1: Math.round((baseBreaker.terminalTemperatures.lineL1 * heatMultiplier) * 10) / 10,
        lineL2: Math.round((baseBreaker.terminalTemperatures.lineL2 * (ov.phaseL2Temp ? 1.4 : 1.0) * heatMultiplier) * 10) / 10,
        lineL3: Math.round((baseBreaker.terminalTemperatures.lineL3 * heatMultiplier) * 10) / 10,
        loadL1: termL1,
        loadL2: termL2,
        loadL3: termL3,
      },
      deltaT: Math.round((termL2 - Math.min(termL1, termL3)) * 10) / 10,
      contactResistanceL2: resL2,
      contactWear,
      latchMs,
      arcIndex,
      leakageUa,
      thdVal,
      healthIndex: ov.healthIndex,
      status: ov.status,
      remainingUsefulLifeDays: ov.remainingUsefulLifeDays,
    };
  }, [baseBreaker, activeScenario, loadPercent]);

  return (
    <section id="simulator" className="py-20 bg-slate-900/40 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
              Interactive Hardware Emulation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              MCCB Digital Twin & Fault Prognosis Simulator
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Inject real-world switchgear physical degradation vectors into live breaker telemetry. Observe how multi-parameter analytics detect faults days before conventional thermal trip units react.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedScenarioId('nominal');
                setLoadPercent(85);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Nominal</span>
            </button>
          </div>
        </div>

        {/* Top Control Bar: Breaker Selector & Failure Vector Injection */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 1. Target Breaker Asset Selector */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs font-medium text-slate-400 mb-2">
              Step 1: Select Monitored Breaker Asset
            </div>
            <div className="space-y-2">
              {INITIAL_BREAKERS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBreakerId(b.id)}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedBreakerId === b.id
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{b.tag}</span>
                    <span className="font-mono text-cyan-400">{b.ratedCurrent}A / {b.voltageRating}V</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 truncate">{b.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Failure Vector Injector */}
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">
                Step 2: Inject Degradation Vector
              </span>
              <span className="text-xs font-mono text-cyan-400">
                Simulation Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FAILURE_SCENARIOS.map((s) => {
                const isSelected = selectedScenarioId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenarioId(s.id)}
                    className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold truncate">{s.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {s.category}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Load Adjustment Slider */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Load Factor:</span>
                <span className="font-mono font-semibold text-white">{loadPercent}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="125"
                step="5"
                value={loadPercent}
                onChange={(e) => setLoadPercent(Number(e.target.value))}
                className="w-48 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Main Live Telemetry Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Key Health Indices & RUL (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Master Health Card */}
            <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Breaker Health Index
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    telemetry.status === 'healthy'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : telemetry.status === 'warning'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {telemetry.status.toUpperCase()}
                </span>
              </div>

              {/* Big Score Dial */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                  {telemetry.healthIndex}
                </span>
                <span className="text-slate-400 text-lg font-mono">/ 100</span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    telemetry.healthIndex > 80
                      ? 'bg-emerald-500'
                      : telemetry.healthIndex > 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${telemetry.healthIndex}%` }}
                />
              </div>

              {/* Estimated RUL & Pre-Trip Warning Window */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Estimated RUL</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-white tabular-nums">
                    {telemetry.remainingUsefulLifeDays} <span className="text-xs font-sans text-slate-400">days</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lead Window</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-amber-300 tabular-nums">
                    {activeScenario.timeToFailureWithoutIntervention.split(' ')[0]}{' '}
                    <span className="text-xs font-sans text-slate-400">hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subsystem Health Metrics */}
            <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4 text-xs">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Subsystem Integrity Matrix
              </div>

              {/* Metric: Contact Resistance */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <div className="font-medium text-slate-200">Contact Resistance (L2)</div>
                  <div className="text-[11px] text-slate-400">Nominal: &lt; 35 µΩ (IEEE 1458)</div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm tabular-nums ${
                      telemetry.contactResistanceL2 > 70
                        ? 'text-rose-400'
                        : telemetry.contactResistanceL2 > 45
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {telemetry.contactResistanceL2} µΩ
                  </span>
                </div>
              </div>

              {/* Metric: Latch Clearing Time */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <div className="font-medium text-slate-200">Mechanical Release Time</div>
                  <div className="text-[11px] text-slate-400">Design Spec: 12.0 - 16.0 ms</div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm tabular-nums ${
                      telemetry.latchMs > 25
                        ? 'text-rose-400'
                        : telemetry.latchMs > 17
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {telemetry.latchMs} ms
                  </span>
                </div>
              </div>

              {/* Metric: Arc Extinction Index */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
                <div>
                  <div className="font-medium text-slate-200">Arc Chute Integrity</div>
                  <div className="text-[11px] text-slate-400">Optical De-ionization Grid</div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm tabular-nums ${
                      telemetry.arcIndex < 60
                        ? 'text-rose-400'
                        : telemetry.arcIndex < 85
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {telemetry.arcIndex}%
                  </span>
                </div>
              </div>

              {/* Metric: Dielectric Leakage */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-200">Dielectric Leakage Current</div>
                  <div className="text-[11px] text-slate-400">Micro-amp barrier drift</div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold text-sm tabular-nums ${
                      telemetry.leakageUa > 15
                        ? 'text-rose-400'
                        : telemetry.leakageUa > 5
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {telemetry.leakageUa} µA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Point Thermography & Phase Electrical Telemetry (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 3-Phase Thermal Matrix (Line vs Load Terminals) */}
            <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-rose-400" />
                    Multi-Point Terminal Thermography & Thermal Gradient (ΔT)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Continuous infrared thermopile array reading Line vs Load lugs across all three phases.
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  Phase Imbalance ΔT:{' '}
                  <span
                    className={`font-bold ${
                      telemetry.deltaT > 25
                        ? 'text-rose-400'
                        : telemetry.deltaT > 10
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    +{telemetry.deltaT}°C
                  </span>
                </div>
              </div>

              {/* Visual Breaker Terminal Heat Map */}
              <div className="grid grid-cols-3 gap-4">
                {/* Phase L1 */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 text-center">
                  <div className="text-xs font-bold text-cyan-400 mb-2">Phase L1 (R)</div>
                  <div className="text-[11px] text-slate-400">Line Lug</div>
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    {telemetry.temperatures.lineL1}°C
                  </div>
                  <div className="my-2 border-t border-slate-800/60" />
                  <div className="text-[11px] text-slate-400">Load Lug</div>
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    {telemetry.temperatures.loadL1}°C
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    {telemetry.currents.L1} A
                  </div>
                </div>

                {/* Phase L2 */}
                <div
                  className={`p-4 rounded-xl border text-center transition-colors ${
                    telemetry.temperatures.loadL2 > 80
                      ? 'bg-rose-950/30 border-rose-500/60'
                      : telemetry.temperatures.loadL2 > 65
                      ? 'bg-amber-950/30 border-amber-500/60'
                      : 'bg-slate-900/70 border-slate-800/80'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-400 mb-2">Phase L2 (Y)</div>
                  <div className="text-[11px] text-slate-400">Line Lug</div>
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    {telemetry.temperatures.lineL2}°C
                  </div>
                  <div className="my-2 border-t border-slate-800/60" />
                  <div className="text-[11px] text-slate-400">Load Lug</div>
                  <div
                    className={`font-mono text-xl font-extrabold tabular-nums ${
                      telemetry.temperatures.loadL2 > 80
                        ? 'text-rose-400 animate-pulse'
                        : telemetry.temperatures.loadL2 > 65
                        ? 'text-amber-400'
                        : 'text-white'
                    }`}
                  >
                    {telemetry.temperatures.loadL2}°C
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    {telemetry.currents.L2} A
                  </div>
                </div>

                {/* Phase L3 */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 text-center">
                  <div className="text-xs font-bold text-blue-400 mb-2">Phase L3 (B)</div>
                  <div className="text-[11px] text-slate-400">Line Lug</div>
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    {telemetry.temperatures.lineL3}°C
                  </div>
                  <div className="my-2 border-t border-slate-800/60" />
                  <div className="text-[11px] text-slate-400">Load Lug</div>
                  <div className="font-mono text-lg font-bold text-white tabular-nums">
                    {telemetry.temperatures.loadL3}°C
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    {telemetry.currents.L3} A
                  </div>
                </div>
              </div>

              {/* Thermal standard benchmark notes */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>NETA MTS standard: ΔT &gt; 15°C indicates major thermal defect.</span>
                <span>Max allowable temperature for 90°C rated terminals: 90.0°C</span>
              </div>
            </div>

            {/* Diagnostic Interpretation & Prescribed Action Box */}
            <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                      Predictive Failure Diagnosis
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Algorithm: ISO 13374 Condition Prognosis
                    </span>
                  </div>
                  <h4 className="mt-1 text-base font-bold text-white">
                    {activeScenario.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {activeScenario.description}
                  </p>
                </div>

                <button
                  onClick={() => onOpenAiPrognosis(baseBreaker, selectedScenarioId)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Prognosis Report</span>
                </button>
              </div>

              {/* Recommended Intervention */}
              <div className="mt-5 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800/90">
                <div className="text-xs font-semibold text-white flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Prescribed Maintenance Action:
                </div>
                <div className="text-xs text-slate-300">
                  {activeScenario.recommendedIntervention}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
