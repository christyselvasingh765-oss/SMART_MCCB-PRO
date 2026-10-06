import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Simulator } from './components/Simulator';
import { FailureModes } from './components/FailureModes';
import { FleetMonitor } from './components/FleetMonitor';
import { RoiCalculator } from './components/RoiCalculator';
import { Architecture } from './components/Architecture';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AiDiagnosticsModal } from './components/AiDiagnosticsModal';
import { SpecDownloadModal } from './components/SpecDownloadModal';
import { BreakerTelemetry, FailureScenarioId } from './types/breaker';
import { INITIAL_BREAKERS } from './data/mockBreakers';

export default function App() {
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [aiModalState, setAiModalState] = useState<{
    isOpen: boolean;
    breaker: BreakerTelemetry;
    scenarioId: FailureScenarioId;
  }>({
    isOpen: false,
    breaker: INITIAL_BREAKERS[0],
    scenarioId: 'terminal_hotspot',
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAiPrognosis = (breaker: BreakerTelemetry, scenarioId: FailureScenarioId) => {
    setAiModalState({
      isOpen: true,
      breaker,
      scenarioId,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenSimulator={() => scrollToSection('simulator')}
        onOpenSpecDownload={() => setIsSpecModalOpen(true)}
        activeSection="hero"
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onScrollToSimulator={() => scrollToSection('simulator')}
          onOpenSpecDownload={() => setIsSpecModalOpen(true)}
        />

        <Simulator onOpenAiPrognosis={handleOpenAiPrognosis} />

        <FailureModes />

        <FleetMonitor />

        <RoiCalculator />

        <Architecture />

        <ContactSection />
      </main>

      {/* Quiet Professional Footer */}
      <Footer />

      {/* Interactive AI Prognosis Modal */}
      <AiDiagnosticsModal
        isOpen={aiModalState.isOpen}
        onClose={() => setAiModalState((prev) => ({ ...prev, isOpen: false }))}
        breaker={aiModalState.breaker}
        scenarioId={aiModalState.scenarioId}
      />

      {/* Technical Spec & Whitepaper Download Modal */}
      <SpecDownloadModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />
    </div>
  );
}
