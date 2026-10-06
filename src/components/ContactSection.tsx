import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Mail, Building, Phone } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facilityType: 'datacenter',
    mccbCount: '10-50',
    painPoint: 'terminal_hotspots',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              Field Pilot & Switchgear Audit
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Deploy Smart MCCB Pro in Your High-Risk Switchboard
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We provide 30-day non-intrusive evaluation kits for critical main incomers and feeder panels. Our field engineering team handles clamp-on collar commissioning with zero downtime to your live loads.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Zero plant outage during sensor collar installation</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Pre-configured Modbus TCP / IEC 61850 gateway included</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Certified IEEE 1458 health assessment report at 30 days</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
              <div>Switchgear Engineering Hotline: +1 (800) 492-MCCB</div>
              <div>Direct Dispatch: engineering@smartmccbpro.com</div>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Audit Request Received
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, {formData.name}. A senior switchgear application engineer will contact <strong className="text-white">{formData.email}</strong> within 4 business hours to review your panel drawings and coordinate non-intrusive sensor delivery.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        facilityType: 'datacenter',
                        mccbCount: '10-50',
                        painPoint: 'terminal_hotspots',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">
                        Full Name & Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. David Vance, Principal Electrical Engineer"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">
                        Corporate Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="david.vance@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">
                        Facility Sector
                      </label>
                      <select
                        value={formData.facilityType}
                        onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="datacenter">Data Center / Mission Critical</option>
                        <option value="semiconductor">Semiconductor Cleanroom</option>
                        <option value="petrochemical">Petrochemical / Refinery</option>
                        <option value="hospital">Hospital & Healthcare</option>
                        <option value="manufacturing">Automated Manufacturing</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-300 mb-1">
                        Primary Predictive Concern
                      </label>
                      <select
                        value={formData.painPoint}
                        onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="terminal_hotspots">Terminal Lug Hotspots & Torque Relaxation</option>
                        <option value="contact_erosion">Contact Erosion & High Micro-Ohms</option>
                        <option value="latch_stickiness">Sluggish Mechanical Latch Release</option>
                        <option value="harmonics">Harmonic Overheating & Spurious Trips</option>
                        <option value="aging">Ageing Fleet Health Assessment</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">
                      Target Switchgear Details (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. 1600A Main Incomer Schneider NSX1600 + 4x 630A distribution feeders, 415V 50Hz, Modbus RTU available in panel."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Switchgear Evaluation Pilot</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
