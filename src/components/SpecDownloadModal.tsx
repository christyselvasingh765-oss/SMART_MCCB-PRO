import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SpecDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecDownloadModal: React.FC<SpecDownloadModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              Smart MCCB Pro Technical Package
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">
              Engineering Spec Package Ready
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              A copy has been dispatched to <strong className="text-white">{email}</strong>. The technical package includes the IEEE 1458 compliance brief, Modbus register map, and 3D CAD step files.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Download the comprehensive hardware specification and integration guide for smart MCCB health monitoring and predictive failure detection.
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-white">Package Contents (v3.2):</div>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>· IEEE 1458 & IEC 60947-2 Failure Vector Methodology</li>
                <li>· High-Frequency Micro-Ohmmeter Hardware Architecture</li>
                <li>· Modbus TCP & IEC 61850 Substation Address Map</li>
                <li>· Retrofit Mechanical Drawing for ABB, Schneider, Siemens, Eaton</li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Work Email Address
              </label>
              <input
                type="email"
                required
                placeholder="chief.engineer@facility.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Company / Substation Utility (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Pacific Power Grid / Alpha Microelectronics"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instant PDF Download</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
