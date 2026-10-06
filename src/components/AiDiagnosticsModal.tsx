import React, { useState, useEffect } from 'react';
import { BreakerTelemetry, FailureScenarioId } from '../types/breaker';
import { FAILURE_SCENARIOS } from '../data/mockBreakers';
import { X, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Download, Copy, Check } from 'lucide-react';

interface AiDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  breaker: BreakerTelemetry;
  scenarioId: FailureScenarioId;
}

export const AiDiagnosticsModal: React.FC<AiDiagnosticsModalProps> = ({
  isOpen,
  onClose,
  breaker,
  scenarioId,
}) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [copied, setCopied] = useState(false);

  const scenario = FAILURE_SCENARIOS.find((s) => s.id === scenarioId) || FAILURE_SCENARIOS[0];

  useEffect(() => {
    if (isOpen) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        setAnalyzing(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, breaker, scenarioId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const reportText = `SMART MCCB PRO — IEEE 1458 DIAGNOSTIC HEALTH ASSESSMENT
Asset: ${breaker.tag} (${breaker.name})
Rating: ${breaker.ratedCurrent}A / ${breaker.voltageRating}V
Diagnostic Scenario: ${scenario.title}
Health Index: ${scenario.telemetryOverrides.healthIndex}/100
Status: ${scenario.telemetryOverrides.status.toUpperCase()}
Est. Lead Window to Failure: ${scenario.timeToFailureWithoutIntervention}

PHYSICS OF FAILURE:
${scenario.description}

RECOMMENDED CORRECTIVE ACTION:
${scenario.recommendedIntervention}

Standards Compliance: IEC 60947-2, IEEE 1458-2017, ISO 13374`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Smart MCCB Pro AI Health Prognosis
              </h3>
              <p className="text-xs text-slate-400">
                Automated ISO 13374 Condition Health Assessment for {breaker.tag}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {analyzing ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mb-4" />
            <div className="text-sm font-semibold text-white">
              Decomposing high-frequency telemetry vectors...
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Correlating terminal ΔT, micro-ohm drift, and MEMS release signatures
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Status & Score Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase">
                  Identified Condition
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {scenario.title}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Category: {scenario.category}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Prognostic Health Score</div>
                <div className="text-2xl font-black font-mono text-cyan-400 tabular-nums">
                  {scenario.telemetryOverrides.healthIndex} / 100
                </div>
              </div>
            </div>

            {/* Advance Lead Time & Risk Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-slate-300">Failure Lead-Time Window:</span>
                </div>
                <div className="text-sm font-bold text-amber-300">
                  {scenario.timeToFailureWithoutIntervention}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-300">Catastrophic Risk Prevented:</span>
                </div>
                <div className="text-xs text-slate-300">
                  {scenario.catastrophicRisk}
                </div>
              </div>
            </div>

            {/* Root Cause Physics Explanation */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Physical Degradation Mechanism
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                {scenario.description}
              </p>
            </div>

            {/* Prescribed Step-by-Step Maintenance Actions */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Prescribed Field Maintenance Procedure
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {scenario.recommendedIntervention}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                Standard: IEC 60947-2 & IEEE 1458
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Report' : 'Copy Report'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
