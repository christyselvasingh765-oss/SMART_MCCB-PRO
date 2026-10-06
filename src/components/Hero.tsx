import React, { useState } from 'react';
import { ArrowUpRight, Play, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HeroProps {
  onScrollToSimulator: () => void;
  onOpenSpecDownload: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScrollToSimulator,
  onOpenSpecDownload,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>('hotspot-contacts');

  const hotspots = [
    {
      id: 'hotspot-terminals',
      title: 'Infrared Terminal RTDs',
      description: 'Continuous Line/Load lug thermometry detects torque relaxation and oxide insulation 72h before thermal runaway.',
      position: 'top-[16%] left-[28%]',
    },
    {
      id: 'hotspot-contacts',
      title: 'In-Line Contact Micro-Ohmmeter',
      description: 'Captures dynamic mV drop under load to calculate micro-ohm wear down to 0.02 µΩ precision.',
      position: 'top-[44%] left-[52%]',
    },
    {
      id: 'hotspot-chute',
      title: 'Optical Arc Chute Sensor',
      description: 'Detects plasma ionization luminescence and carbonization on de-ionization splitter plates.',
      position: 'top-[68%] left-[34%]',
    },
    {
      id: 'hotspot-mems',
      title: 'Tri-Axial MEMS Latch Timing',
      description: 'Acoustic & vibration release fingerprinting flags trip latch stickiness and sluggish opening speed.',
      position: 'top-[52%] left-[72%]',
    },
  ];

  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background radial gradient subtle highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Kicker & Editorial Headline */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-3">
            Industrial Switchgear Telemetry & AI Prognosis
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] [text-wrap:balance]">
            Predict MCCB failures days before your breakers trip.
          </h1>
          <p className="mt-5 text-lg text-slate-300 leading-relaxed max-w-2xl">
            Molded Case Circuit Breakers silently degrade through terminal torque relaxation, micro-welding, and arc chute carbonization. Smart MCCB Pro streams continuous high-frequency physical telemetry, transforming blind trip units into self-diagnosing assets.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onScrollToSimulator}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-lg shadow-cyan-500/15 transition-all whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Breaker Simulator</span>
            </button>
            <button
              onClick={onOpenSpecDownload}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Download Engineering Spec</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Claim-to-Proof Adjacency Row */}
          <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                0.02 <span className="text-cyan-400 text-lg font-sans">µΩ</span>
              </div>
              <div className="mt-1 text-xs text-slate-400 leading-snug">
                Contact resistance measurement resolution
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                120 <span className="text-cyan-400 text-lg font-sans">hrs</span>
              </div>
              <div className="mt-1 text-xs text-slate-400 leading-snug">
                Average advance warning before trip breakdown
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                99.4 <span className="text-cyan-400 text-lg font-sans">%</span>
              </div>
              <div className="mt-1 text-xs text-slate-400 leading-snug">
                True-positive thermal runaway prediction
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                IEEE 1458
              </div>
              <div className="mt-1 text-xs text-slate-400 leading-snug">
                Full compliance with breaker degradation guidelines
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Asset Showcase with Interactive Diagnostic Pinpoints */}
        <div className="mt-12 lg:mt-16 relative">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-2xl">
            {/* The generated high-fidelity product photography */}
            <div className="relative aspect-[16/9] w-full max-h-[580px] bg-slate-900">
              <img
                src="/src/assets/images/hero_smart_mccb_unit_1791267969130.jpg"
                alt="Smart MCCB Pro Industrial Circuit Breaker with integrated IoT sensors"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback styled container if image ever fails
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Gradient Scrim for Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

              {/* Sensor Hotspot Pins overlaid on the product image */}
              {hotspots.map((hs) => {
                const isActive = activeHotspot === hs.id;
                return (
                  <button
                    key={hs.id}
                    onClick={() => setActiveHotspot(isActive ? null : hs.id)}
                    className={`absolute ${hs.position} z-20 group -translate-x-1/2 -translate-y-1/2 focus:outline-none`}
                    aria-label={hs.title}
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isActive ? 'bg-cyan-400' : 'bg-slate-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-6 w-6 items-center justify-center text-[10px] font-bold border transition-colors ${
                          isActive
                            ? 'bg-cyan-500 text-slate-950 border-white'
                            : 'bg-slate-900/90 text-cyan-400 border-cyan-400/60 group-hover:bg-cyan-500 group-hover:text-slate-950'
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Floating Detail Overlay Card for Active Hotspot */}
              {activeHotspot && (
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-30 p-5 rounded-xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-md shadow-2xl">
                  {(() => {
                    const current = hotspots.find((h) => h.id === activeHotspot);
                    if (!current) return null;
                    return (
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold tracking-wide text-cyan-400 uppercase">
                            Sensor Subsystem
                          </span>
                          <span className="text-xs text-slate-400">
                            Telemetry Active
                          </span>
                        </div>
                        <h2 className="mt-1 text-base font-bold text-white">
                          {current.title}
                        </h2>
                        <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                          {current.description}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Quick Inspection Strip below the hero image */}
            <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Non-Intrusive Retrofit:</strong> Mounts on existing ABB, Schneider, Siemens, and Eaton frame sizes without busbar modification.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero False Trips:</strong> Dual-verification algorithms isolate physical degradation from transient grid harmonic anomalies.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Edge Inference:</strong> Onboard micro-processor runs predictive models offline, ensuring continuous protection during network outages.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
