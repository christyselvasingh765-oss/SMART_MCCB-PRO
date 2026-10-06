import React, { useState, useMemo } from 'react';
import { INITIAL_BREAKERS } from '../data/mockBreakers';
import { BreakerTelemetry, BreakerStatus } from '../types/breaker';
import { Search, Sliders, Activity, Download, Eye, AlertCircle, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const FleetMonitor: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedBreaker, setInspectedBreaker] = useState<BreakerTelemetry | null>(null);

  const filteredBreakers = useMemo(() => {
    return INITIAL_BREAKERS.filter((b) => {
      const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
      const matchesSearch =
        b.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [filterStatus, searchQuery]);

  return (
    <section id="fleet-monitor" className="py-20 bg-slate-900/30 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
              Facility-Wide Switchgear Telemetry
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Centralized Breaker Fleet SCADA Console
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Real-time condition health indexing across all installed low-voltage and medium-voltage MCCBs. Seamlessly integrates via Modbus TCP, IEC 61850, and OPC-UA.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            <span>4 / 4 Breakers Online</span>
            <span className="mx-2">·</span>
            <span>Telemetry Refresh: 1000ms</span>
          </div>
        </div>

        {/* Filter and Search Bar (interactive controls) */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Filter Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg w-full sm:w-auto">
            {['all', 'healthy', 'warning', 'critical'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tag, panel, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Breakers Data Grid */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Asset Tag & Panel</th>
                  <th className="py-3.5 px-4 font-semibold">Description & Rating</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Health Index</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Contact Wear</th>
                  <th className="py-3.5 px-4 font-semibold text-right">L2 Temp</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Est. RUL</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredBreakers.map((breaker) => (
                  <tr
                    key={breaker.id}
                    className="hover:bg-slate-900/50 transition-colors cursor-pointer group"
                    onClick={() => setInspectedBreaker(breaker)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white">{breaker.tag}</div>
                      <div className="text-[11px] text-slate-500">{breaker.panelId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{breaker.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {breaker.ratedCurrent}A · {breaker.voltageRating}V · {breaker.breakingCapacity}kA
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-bold text-white tabular-nums">
                        {breaker.healthIndex}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono tabular-nums text-slate-300">
                        {breaker.contactWearPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-mono font-bold tabular-nums ${
                          breaker.phases.L2.temperature > 85
                            ? 'text-rose-400'
                            : breaker.phases.L2.temperature > 65
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {breaker.phases.L2.temperature}°C
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono tabular-nums text-slate-200">
                        {breaker.remainingUsefulLifeDays} d
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          breaker.status === 'healthy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : breaker.status === 'warning'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {breaker.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedBreaker(breaker);
                        }}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Inspect Telemetry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection Modal / Drawer */}
        {inspectedBreaker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Detailed Asset Diagnostics
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {inspectedBreaker.tag} — {inspectedBreaker.name}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {inspectedBreaker.model} · {inspectedBreaker.location}
                  </div>
                </div>
                <button
                  onClick={() => setInspectedBreaker(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Physical Readings Matrix */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                  <div className="text-slate-400">Health Index</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {inspectedBreaker.healthIndex}%
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                  <div className="text-slate-400">Contact Resistance</div>
                  <div className="text-lg font-bold font-mono text-cyan-400 mt-1">
                    {inspectedBreaker.phases.L2.contactResistance} µΩ
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                  <div className="text-slate-400">Latch Timing</div>
                  <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                    {inspectedBreaker.latchReleaseTimeMs} ms
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-850">
                  <div className="text-slate-400">Leakage Current</div>
                  <div className="text-lg font-bold font-mono text-white mt-1">
                    {inspectedBreaker.dielectricLeakageCurrentUa} µA
                  </div>
                </div>
              </div>

              {/* Prescribed Action Advisory */}
              <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Automated Prognosis & Work Order Recommendation:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {inspectedBreaker.nextRecommendedAction}
                </p>
                <div className="mt-3 text-[11px] text-slate-500 font-mono">
                  Last Certified Offline Calibration: {inspectedBreaker.lastInspectionDate}
                </div>
              </div>

              {/* Close / Action footer */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setInspectedBreaker(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    alert(`Exporting IEEE 1458 Diagnostic Health Certificate for ${inspectedBreaker.tag}...`);
                    setInspectedBreaker(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export IEEE 1458 Log</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
