import React, { useState, useMemo } from 'react';
import { DollarSign, ShieldCheck, Clock, TrendingUp, Sliders } from 'lucide-react';

export const RoiCalculator: React.FC = () => {
  const [facilityType, setFacilityType] = useState<string>('datacenter');
  const [mccbCount, setMccbCount] = useState<number>(36);
  const [downtimeCostPerHour, setDowntimeCostPerHour] = useState<number>(85000);
  const [averageOutageDurationHours, setAverageOutageDurationHours] = useState<number>(3.5);

  const facilityProfiles: Record<string, { label: string; defaultDowntime: number }> = {
    datacenter: { label: 'Hyperscale / Colocation Data Center', defaultDowntime: 120000 },
    semiconductor: { label: 'Semiconductor Fabrication Facility', defaultDowntime: 250000 },
    hospital: { label: 'Level 1 Trauma Hospital & Medical Center', defaultDowntime: 90000 },
    manufacturing: { label: 'Automated Continuous Process Plant', defaultDowntime: 45000 },
  };

  const handleFacilityChange = (type: string) => {
    setFacilityType(type);
    if (facilityProfiles[type]) {
      setDowntimeCostPerHour(facilityProfiles[type].defaultDowntime);
    }
  };

  // Calculations
  const results = useMemo(() => {
    // Industry baseline: ~3.2% annual catastrophic breaker failure / nuisance trip rate in unmonitored switchgear (IEEE Gold Book)
    const annualCatastrophicRiskEvents = (mccbCount * 0.032);
    const costPerOutage = downtimeCostPerHour * averageOutageDurationHours;
    const annualRiskExposure = annualCatastrophicRiskEvents * costPerOutage;

    // Smart MCCB Pro captures 98.4% of failure vectors prior to trip
    const preventedOutageLoss = annualRiskExposure * 0.984;

    // Estimated system hardware & monitoring investment (~$1,200 per breaker node)
    const totalSystemInvestment = mccbCount * 1250;

    // Payback period in months
    const monthlyAvoidance = preventedOutageLoss / 12;
    const paybackMonths = Math.max(0.6, Math.min(24, Math.round((totalSystemInvestment / monthlyAvoidance) * 10) / 10));

    // Insurance policy discount savings (~$450/breaker/yr through NETA certification)
    const insuranceSavings = mccbCount * 450;

    return {
      preventedOutageLoss: Math.round(preventedOutageLoss),
      totalSystemInvestment,
      paybackMonths,
      insuranceSavings,
      netFirstYearRoi: Math.round(((preventedOutageLoss + insuranceSavings - totalSystemInvestment) / totalSystemInvestment) * 100),
    };
  }, [mccbCount, downtimeCostPerHour, averageOutageDurationHours]);

  return (
    <section id="roi-calculator" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            Economic & Risk Analysis Model
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Quantify Your Outage Avoidance & Payback
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            According to IEEE Std 493 (Gold Book), an unexpected breaker trip in continuous process industries averages 3.2 hours of downtime. Calculate your facility’s risk mitigation economics below.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            {/* Facility Archetype Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Facility Infrastructure Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(facilityProfiles).map(([key, profile]) => (
                  <button
                    key={key}
                    onClick={() => handleFacilityChange(key)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      facilityType === key
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">{profile.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-5 pt-2">
              {/* Slider 1: Monitored MCCB Count */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300">Installed Critical MCCBs:</span>
                  <span className="font-mono font-bold text-white text-sm">{mccbCount} Units</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="2"
                  value={mccbCount}
                  onChange={(e) => setMccbCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 2: Downtime Cost Per Hour */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300">Unscheduled Blackout Cost:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    ${downtimeCostPerHour.toLocaleString()} / hr
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="350000"
                  step="5000"
                  value={downtimeCostPerHour}
                  onChange={(e) => setDowntimeCostPerHour(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 3: Outage Duration */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300">Average Switchgear Restoration Window:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {averageOutageDurationHours} Hours
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={averageOutageDurationHours}
                  onChange={(e) => setAverageOutageDurationHours(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-4">
                Projected Economic Value
              </div>

              {/* Primary Metric: Avoided Loss */}
              <div className="pb-6 border-b border-slate-800/80">
                <div className="text-xs text-slate-400">Annual Prevented Downtime Loss</div>
                <div className="mt-1 text-4xl sm:text-5xl font-black font-mono text-white tabular-nums">
                  ${(results.preventedOutageLoss / 1000).toFixed(0)}k
                </div>
                <div className="mt-1.5 text-xs text-emerald-400 font-medium">
                  Based on 98.4% predictive capture rate of failure vectors
                </div>
              </div>

              {/* Secondary Metrics */}
              <div className="py-6 border-b border-slate-800/80 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400">Payback Horizon</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-cyan-300 tabular-nums">
                    {results.paybackMonths} <span className="text-xs font-sans text-slate-400">months</span>
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">1st Year Net ROI</div>
                  <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                    +{results.netFirstYearRoi}%
                  </div>
                </div>
              </div>

              {/* Insurance Underwriting Benefit */}
              <div className="pt-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Insurer Premium Reduction Credit:</span>
                </div>
                <div className="font-mono font-semibold text-white">
                  ~${results.insuranceSavings.toLocaleString()} / year under NETA predictive policy riders
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/60">
              <a
                href="#contact"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm transition-all"
              >
                <span>Request Custom Switchgear Audit</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
