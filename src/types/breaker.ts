export type BreakerStatus = 'healthy' | 'warning' | 'critical';

export interface PhaseTelemetry {
  current: number; // Amps
  voltage: number; // Volts
  temperature: number; // °C
  contactResistance: number; // µΩ (micro-ohms)
  powerFactor: number;
}

export interface BreakerTelemetry {
  id: string;
  tag: string;
  name: string;
  model: string;
  ratedCurrent: number; // Amps (e.g., 630A, 1600A)
  voltageRating: number; // Volts (e.g., 415V, 690V)
  breakingCapacity: number; // kA (e.g., 50kA, 70kA)
  installationDate: string;
  location: string;
  panelId: string;
  status: BreakerStatus;
  healthIndex: number; // 0 to 100%
  remainingUsefulLifeDays: number;
  totalTripsCount: number;
  maxMechanicalCycles: number;
  currentCycles: number;
  contactWearPercent: number; // 0 to 100%
  latchReleaseTimeMs: number; // Nominal ~12-16ms
  vibrationRmsG: number; // RMS vibration during operation
  thdCurrentPercent: number; // Total Harmonic Distortion
  dielectricLeakageCurrentUa: number; // µA
  phases: {
    L1: PhaseTelemetry;
    L2: PhaseTelemetry;
    L3: PhaseTelemetry;
  };
  terminalTemperatures: {
    lineL1: number;
    lineL2: number;
    lineL3: number;
    loadL1: number;
    loadL2: number;
    loadL3: number;
  };
  arcChuteHealthIndex: number; // 0 to 100%
  lastInspectionDate: string;
  nextRecommendedAction: string;
}

export type FailureScenarioId =
  | 'nominal'
  | 'terminal_hotspot'
  | 'contact_erosion'
  | 'arc_chute_carbon'
  | 'latch_mechanism_wear'
  | 'harmonic_overheating';

export interface FailureScenario {
  id: FailureScenarioId;
  title: string;
  category: string;
  description: string;
  earlyIndicators: string[];
  catastrophicRisk: string;
  timeToFailureWithoutIntervention: string;
  detectionMechanism: string;
  telemetryOverrides: {
    healthIndex: number;
    status: BreakerStatus;
    remainingUsefulLifeDays: number;
    contactWearPercent?: number;
    latchReleaseTimeMs?: number;
    vibrationRmsG?: number;
    thdCurrentPercent?: number;
    dielectricLeakageCurrentUa?: number;
    arcChuteHealthIndex?: number;
    phaseL2Temp?: number;
    phaseL2Resistance?: number;
    terminalHotspotLoadL2?: number;
  };
  recommendedIntervention: string;
}

export interface FailureModeInfo {
  id: string;
  title: string;
  subsystem: string;
  physicalCause: string;
  conventionalDetection: string;
  smartMccbProDetection: string;
  leadTimeHours: number;
  riskSeverity: 'Critical' | 'High' | 'Severe';
  standardReference: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'advisory';

export interface SystemAlert {
  id: string;
  breakerId: string;
  breakerTag: string;
  breakerName: string;
  panelId: string;
  timestamp: string;
  severity: AlertSeverity;
  anomalyTitle: string;
  affectedPhase: 'L1' | 'L2' | 'L3' | '3-Phase' | 'Chassis';
  telemetryMetric: string;
  currentValue: string;
  nominalThreshold: string;
  timeToFailureEstimate: string;
  riskDescription: string;
  recommendedAction: string;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  workOrderGenerated?: boolean;
}
