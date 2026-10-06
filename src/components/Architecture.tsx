import React from 'react';
import { Cpu, Radio, Server, ShieldCheck, Layers, ArrowRight } from 'lucide-react';

export const Architecture: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Precision Physical Sensing Collar',
      desc: 'Clips around existing MCCB terminal lugs and chassis without busbar drilling or service outage. Houses dual-wavelength infrared thermopiles, Rogowski coils, and 3-axis MEMS accelerometers.',
      specs: '10 kS/s sampling rate · 0.02 µΩ resolution',
    },
    {
      num: '02',
      title: 'Local Edge Micro-Processor Inference',
      desc: 'Executes degradation modeling offline inside the switchgear cabinet. Computes thermal differential gradients, harmonic decomposition (FFT), and mechanical opening velocity signatures locally.',
      specs: 'ARM Cortex-M7 · DIN-rail mounted · 24V DC auxiliary',
    },
    {
      num: '03',
      title: 'Universal Substation Protocol Streaming',
      desc: 'Transmits health states simultaneously to plant SCADA via Modbus TCP / IEC 61850 and to enterprise asset management platforms via secure TLS MQTT or OPC-UA.',
      specs: 'Modbus TCP · IEC 61850 GOOSE · MQTT TLS · BACnet IP',
    },
    {
      num: '04',
      title: 'AI Prognostic & Work Order Generation',
      desc: 'Transforms raw electrical drift into human-actionable maintenance tickets. Recommends calibrated torque checks, contact replacement schedules, or load balancing before an outage strikes.',
      specs: 'ISO 13374 architecture · CMMS API webhooks',
    },
  ];

  return (
    <section id="overview" className="py-20 bg-slate-900/40 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            System Topology & Data Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Retrofit & Mission-Critical Reliability
          </h2>
          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            From the copper busbar interface to central SCADA and cloud predictive analytics, Smart MCCB Pro operates seamlessly in air-gapped substations and modern smart factories.
          </p>
        </div>

        {/* Feature Bento Layout with Industrial Photography Asset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Visual Showcase (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between">
            <div className="relative aspect-[16/9] w-full bg-slate-900">
              <img
                src="/src/assets/images/industrial_switchgear_panel_1791267982933.jpg"
                alt="Modern electrical distribution switchgear control room"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                Zero-Intrusion Retrofit Guarantee
              </div>
              <h3 className="text-lg font-bold text-white">
                Compatible with Leading Global Switchgear
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Pre-calibrated form factors for ABB Tmax XT, Schneider Electric ComPact NSX, Siemens 3VA, and Eaton Power Defense molded case circuit breakers.
              </p>
            </div>
          </div>

          {/* 4-Step Technical Architecture Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {steps.map((st) => (
              <div
                key={st.num}
                className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-cyan-400 mb-2">
                    {st.num}. Architecture Layer
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{st.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  {st.specs}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Strip */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">Native Industrial Protocols:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-slate-400">
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">Modbus TCP / RTU</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">IEC 61850 (MMS & GOOSE)</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">OPC Unified Architecture (OPC-UA)</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">MQTT with TLS 1.3</span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded">BACnet/IP</span>
          </div>
        </div>
      </div>
    </section>
  );
};
