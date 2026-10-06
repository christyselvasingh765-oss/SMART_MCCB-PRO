import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Sparkles,
  Sliders,
  Filter,
  Check,
  FileText,
  Activity,
  PlusCircle,
  RotateCcw,
} from 'lucide-react';
import { SystemAlert, AlertSeverity } from '../types/breaker';
import { INITIAL_ALERTS, SIMULATABLE_ALERTS } from '../data/mockBreakers';

interface ActiveAlertsProps {
  onInspectInSimulator?: (breakerId: string) => void;
}

export const ActiveAlerts: React.FC<ActiveAlertsProps> = ({ onInspectInSimulator }) => {
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [unackOnly, setUnackOnly] = useState<boolean>(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [nextSimIndex, setNextSimIndex] = useState<number>(0);
  const [workOrderNotice, setWorkOrderNotice] = useState<string | null>(null);

  // Counters
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const advisoryCount = alerts.filter((a) => a.severity === 'advisory').length;
  const unackCount = alerts.filter((a) => !a.isAcknowledged).length;
  const workOrderCount = alerts.filter((a) => a.workOrderGenerated).length;

  // Filtered list
  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchesUnack = !unackOnly || !a.isAcknowledged;
    return matchesSeverity && matchesUnack;
  });

  // Action: Acknowledge alert
  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              isAcknowledged: true,
              acknowledgedBy: 'Control Room Operator (Current Session)',
            }
          : a
      )
    );
  };

  // Action: Batch Acknowledge
  const handleAcknowledgeAll = () => {
    setAlerts((prev) =>
      prev.map((a) => ({
        ...a,
        isAcknowledged: true,
        acknowledgedBy: 'Control Room Lead (Batch)',
      }))
    );
  };

  // Action: Escalate Work Order
  const handleEscalateWorkOrder = (alert: SystemAlert) => {
    const workOrderNum = `WO-MCCB-${Math.floor(1000 + Math.random() * 9000)}`;
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? {
              ...a,
              isAcknowledged: true,
              workOrderGenerated: true,
              acknowledgedBy: a.acknowledgedBy || 'Shift Maintenance Supervisor',
            }
          : a
      )
    );
    setWorkOrderNotice(
      `Dispatched Emergency Priority Work Order ${workOrderNum} for ${alert.breakerTag} (${alert.anomalyTitle}). Notified Switchgear Response Team.`
    );
    setTimeout(() => {
      setWorkOrderNotice(null);
    }, 6000);
  };

  // Action: Simulate new real-time anomaly
  const handleSimulateNewAnomaly = () => {
    const candidate = SIMULATABLE_ALERTS[nextSimIndex % SIMULATABLE_ALERTS.length];
    const newAlert: SystemAlert = {
      ...candidate,
      id: `alt-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now (Live Injected)',
      isAcknowledged: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setNextSimIndex((prev) => prev + 1);
    setSelectedAlertId(newAlert.id);
  };

  return (
    <section id="active-alerts" className="py-20 bg-slate-950 border-t border-slate-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-xs font-semibold tracking-wider text-rose-400 uppercase">
                Continuous Telemetry Surveillance
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Active MCCB Anomaly & Early Warning Console
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
              Physical degradation anomalies flagged by onboard infrared RTDs, live contact micro-ohm bridges, and MEMS release acoustic sensors before trip threshold violations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateNewAnomaly}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors shadow-sm"
              title="Inject a simulated anomaly into the live feed"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate Live Anomaly</span>
            </button>

            {unackCount > 0 && (
              <button
                onClick={handleAcknowledgeAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Acknowledge All ({unackCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Work Order Dispatch Banner Notification */}
        {workOrderNotice && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-cyan-200 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{workOrderNotice}</span>
            </div>
            <button
              onClick={() => setWorkOrderNotice(null)}
              className="text-cyan-400 hover:text-white text-xs font-semibold underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4-KPI Overview Metric Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Critical Flashover Warnings</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white tabular-nums">
              {criticalCount}
            </div>
            <div className="mt-1 text-[11px] text-rose-400 font-medium">
              Immediate thermal runaway or micro-welding
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subsystem Warnings</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white tabular-nums">
              {warningCount}
            </div>
            <div className="mt-1 text-[11px] text-amber-400 font-medium">
              Torque looseness or latch sluggishness
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Unacknowledged Alerts</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white tabular-nums">
              {unackCount}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 font-medium">
              Requires control room sign-off
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Work Orders Generated</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white tabular-nums">
              {workOrderCount}
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 font-medium">
              Escalated to facility maintenance crew
            </div>
          </div>
        </div>

        {/* Filter Controls (Segmented Tabs & Checkbox) */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterSeverity === 'all'
                  ? 'bg-slate-850 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterSeverity === 'critical'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterSeverity === 'warning'
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              Warning ({warningCount})
            </button>
            <button
              onClick={() => setFilterSeverity('advisory')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                filterSeverity === 'advisory'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              Advisory ({advisoryCount})
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unackOnly}
              onChange={(e) => setUnackOnly(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:outline-none"
            />
            <span>Show Unacknowledged Only</span>
          </label>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-base font-semibold text-white">
                No active anomalies matching criteria
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                All monitored circuit breakers are running within nominal thermal and mechanical thresholds.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlertId === alert.id;
              return (
                <div
                  key={alert.id}
                  className={`rounded-xl border transition-all ${
                    alert.severity === 'critical'
                      ? 'bg-slate-900/70 border-rose-900/60 hover:border-rose-700/80'
                      : alert.severity === 'warning'
                      ? 'bg-slate-900/50 border-amber-900/50 hover:border-amber-700/80'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Alert Main Row */}
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Metadata & Title */}
                      <div className="space-y-1.5 flex-1">
                        {/* Clean unboxed metadata with bullet separators */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span
                            className={`font-semibold uppercase tracking-wider font-mono text-[10px] px-2 py-0.5 rounded ${
                              alert.severity === 'critical'
                                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                : alert.severity === 'warning'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="font-mono font-bold text-white">
                            {alert.breakerTag}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{alert.panelId}</span>
                          <span aria-hidden="true">·</span>
                          <span>Phase: {alert.affectedPhase}</span>
                          <span aria-hidden="true">·</span>
                          <span>{alert.timestamp}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {alert.anomalyTitle}
                        </h3>

                        {/* Sensor Metric & Current vs Nominal Comparison */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                          <div>
                            <span className="text-slate-400">Sensor:</span>{' '}
                            <span className="font-medium text-slate-200">
                              {alert.telemetryMetric}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Live Reading:</span>{' '}
                            <span
                              className={`font-mono font-bold tabular-nums ${
                                alert.severity === 'critical'
                                  ? 'text-rose-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {alert.currentValue}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Design Limit:</span>{' '}
                            <span className="font-mono text-slate-400">
                              {alert.nominalThreshold}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2.5 lg:self-center">
                        <button
                          onClick={() => setSelectedAlertId(isSelected ? null : alert.id)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
                        >
                          {isSelected ? 'Hide Details' : 'View Root-Cause'}
                        </button>

                        {!alert.isAcknowledged ? (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Acknowledge</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Acknowledged</span>
                          </span>
                        )}

                        {!alert.workOrderGenerated ? (
                          <button
                            onClick={() => handleEscalateWorkOrder(alert)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-500/10"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Dispatch Work Order</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg font-mono">
                            <span>Work Order Dispatched</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Engineering Drawer */}
                  {isSelected && (
                    <div className="p-5 bg-slate-950/90 border-t border-slate-800 space-y-4 text-xs animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Failure Window & Risk */}
                        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                          <div className="text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span className="font-semibold text-slate-200">
                              Predicted Advance Window:
                            </span>
                          </div>
                          <div className="text-xs font-bold text-amber-300">
                            {alert.timeToFailureEstimate}
                          </div>
                          <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                            {alert.riskDescription}
                          </p>
                        </div>

                        {/* Prescribed Corrective Action */}
                        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                          <div className="text-slate-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-semibold text-slate-200">
                              Prescribed Field Procedure:
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {alert.recommendedAction}
                          </p>
                        </div>
                      </div>

                      {/* Acknowledgement Status / Audit Trail */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 border-t border-slate-850">
                        <div>
                          Asset: <strong className="text-slate-200">{alert.breakerName}</strong> ({alert.breakerTag})
                        </div>
                        {alert.acknowledgedBy && (
                          <div className="font-mono text-slate-400">
                            Operator: <span className="text-slate-200">{alert.acknowledgedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
