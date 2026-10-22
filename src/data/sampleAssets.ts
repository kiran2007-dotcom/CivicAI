import { IssueCategory, SeverityLevel, PriorityLevel } from '../types';

export interface SampleIssueScenario {
  id: string;
  name: string;
  category: IssueCategory;
  title: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  landmark: string;
  zone: string;
  imageUrl: string;
  aiResult: {
    issueCategory: IssueCategory;
    description: string;
    severity: SeverityLevel;
    priority: PriorityLevel;
    confidence: number;
    recommendedDepartment: string;
    reasoning: string;
    estimatedResolutionHours: number;
  };
}

// Crisp, lightweight SVG images representing realistic civic defect scenes
export const SAMPLE_POTHOLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="road" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23334155"/><stop offset="100%" stop-color="%231e293b"/></linearGradient><linearGradient id="crater" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23020617"/></linearGradient></defs><rect width="600" height="400" fill="url(%23road)"/><path d="M 0 190 L 600 190" stroke="%23fbbf24" stroke-width="6" stroke-dasharray="25,15"/><ellipse cx="310" cy="240" rx="140" ry="75" fill="url(%23crater)" stroke="%23475569" stroke-width="5"/><path d="M 180 240 Q 220 285 310 280 T 430 220 Q 360 190 280 200 Z" fill="%23090d16"/><circle cx="270" cy="235" r="14" fill="%231e293b"/><circle cx="340" cy="250" r="18" fill="%231e293b"/><path d="M 230 180 L 160 140 M 390 210 L 480 190 M 320 295 L 350 350 M 210 270 L 150 320" stroke="%230f172a" stroke-width="3" stroke-linecap="round"/><rect x="20" y="20" width="170" height="36" rx="6" fill="%23000000" fill-opacity="0.75"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">CIVIC PHOTO EVIDENCE</text><text x="32" y="375" fill="%2394a3b8" font-family="sans-serif" font-size="13">Bengaluru MG Road • 12.9756 N, 77.6092 E</text></svg>`;

export const SAMPLE_GARBAGE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="ground" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23475569"/><stop offset="100%" stop-color="%23334155"/></linearGradient></defs><rect width="600" height="400" fill="url(%23ground)"/><rect x="0" y="0" width="600" height="140" fill="%2364748b"/><line x1="0" y1="140" x2="600" y2="140" stroke="%2394a3b8" stroke-width="6"/><rect x="180" y="100" width="240" height="180" rx="12" fill="%231e3a5f" stroke="%2338bdf8" stroke-width="4"/><text x="230" y="160" fill="%23ffffff" font-family="sans-serif" font-size="18" font-weight="bold">MUNICIPAL BIN</text><path d="M 120 330 C 160 220, 240 230, 290 260 C 340 210, 440 220, 480 330 Z" fill="%23166534" opacity="0.9"/><path d="M 150 320 C 180 260, 220 270, 260 320 Z" fill="%23b45309"/><path d="M 270 340 C 310 270, 360 280, 410 335 Z" fill="%23475569"/><path d="M 330 310 C 360 250, 400 260, 440 315 Z" fill="%230284c7"/><rect x="20" y="20" width="170" height="36" rx="6" fill="%23000000" fill-opacity="0.75"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">CIVIC PHOTO EVIDENCE</text><text x="32" y="375" fill="%23cbd5e1" font-family="sans-serif" font-size="13">Indiranagar 100ft Road • 12.9716 N, 77.6412 E</text></svg>`;

export const SAMPLE_WATER_LEAK_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="wetPavement" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="waterFlow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="100%" stop-color="%230284c7"/></linearGradient></defs><rect width="600" height="400" fill="url(%23wetPavement)"/><path d="M 80 200 Q 250 180 340 220 T 520 230" stroke="%2364748b" stroke-width="26" fill="none" stroke-linecap="round"/><ellipse cx="320" cy="225" rx="160" ry="80" fill="url(%23waterFlow)" opacity="0.75"/><path d="M 315 150 Q 320 180 320 215" stroke="%23e0f2fe" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="320" cy="140" r="10" fill="%2338bdf8"/><circle cx="340" cy="165" r="7" fill="%237dd3fc"/><circle cx="295" cy="170" r="8" fill="%237dd3fc"/><ellipse cx="320" cy="225" rx="90" ry="40" fill="%23e0f2fe" opacity="0.6"/><rect x="20" y="20" width="170" height="36" rx="6" fill="%23000000" fill-opacity="0.75"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">CIVIC PHOTO EVIDENCE</text><text x="32" y="375" fill="%23cbd5e1" font-family="sans-serif" font-size="13">Koramangala 4th Block • 12.9344 N, 77.6271 E</text></svg>`;

export const SAMPLE_STREETLIGHT_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23090d16"/><line x1="200" y1="380" x2="200" y2="100" stroke="%23475569" stroke-width="14" stroke-linecap="round"/><path d="M 200 100 Q 200 50 260 50 L 320 50" fill="none" stroke="%23475569" stroke-width="12" stroke-linecap="round"/><polygon points="300,50 340,50 330,85 310,85" fill="%23334155"/><ellipse cx="320" cy="88" rx="16" ry="8" fill="%231e293b" stroke="%23ef4444" stroke-width="3"/><line x1="310" y1="95" x2="305" y2="125" stroke="%23ef4444" stroke-width="3" stroke-dasharray="4,4"/><line x1="330" y1="95" x2="335" y2="120" stroke="%23f59e0b" stroke-width="3" stroke-dasharray="4,4"/><text x="345" y="94" fill="%23f87171" font-family="sans-serif" font-size="12" font-weight="bold">BROKEN / OUT OF ORDER</text><rect x="0" y="370" width="600" height="30" fill="%231e293b"/><rect x="20" y="20" width="170" height="36" rx="6" fill="%23000000" fill-opacity="0.75"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">CIVIC PHOTO EVIDENCE</text><text x="32" y="375" fill="%2394a3b8" font-family="sans-serif" font-size="13">Whitefield Main Road • 12.9698 N, 77.7499 E</text></svg>`;

export const SAMPLE_REPAIR_PROGRESS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><rect x="100" y="160" width="400" height="180" fill="%23334155" rx="8"/><polygon points="260,180 290,130 320,180" fill="%23f59e0b"/><rect x="282" y="180" width="16" height="30" fill="%23d97706"/><text x="220" y="240" fill="%2338bdf8" font-family="sans-serif" font-size="20" font-weight="bold">CIVIC REPAIR IN PROGRESS</text><text x="210" y="275" fill="%23cbd5e1" font-family="sans-serif" font-size="14">Municipal Field Crew On-Site • Safety Barricaded</text><rect x="20" y="20" width="180" height="36" rx="6" fill="%23000000" fill-opacity="0.75"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">WORKER PROGRESS EVIDENCE</text></svg>`;

export const SAMPLE_COMPLETED_REPAIR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="80" y="120" width="440" height="200" fill="%231e293b" rx="12" stroke="%2322c55e" stroke-width="4"/><circle cx="300" cy="180" r="32" fill="%2322c55e"/><path d="M 288 180 L 297 190 L 314 170" fill="none" stroke="%23ffffff" stroke-width="5" stroke-linecap="round"/><text x="180" y="250" fill="%234ade80" font-family="sans-serif" font-size="22" font-weight="bold">WORK SUCCESSFULLY COMPLETED</text><text x="180" y="280" fill="%23cbd5e1" font-family="sans-serif" font-size="14">Surface Resurfaced & Inspected to City Code</text><rect x="20" y="20" width="190" height="36" rx="6" fill="%23000000" fill-opacity="0.75"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="13" font-weight="bold">COMPLETION PROOF EVIDENCE</text></svg>`;

export const SAMPLE_SCENARIOS: SampleIssueScenario[] = [
  {
    id: 'pothole',
    name: 'Pothole Sample',
    category: 'Pothole',
    title: 'Severe Pothole on Central Carriageway',
    description: 'Deep circular pothole approximately 1.5m wide causing vehicle swerving and tire damage near the metro pillar.',
    address: 'Near Metro Pillar 142, MG Road, Bengaluru, Karnataka 560001',
    lat: 12.9756,
    lng: 77.6092,
    landmark: 'Opposite Central Mall / Metro Pillar 142',
    zone: 'East Zone - Ward 112',
    imageUrl: SAMPLE_POTHOLE_SVG,
    aiResult: {
      issueCategory: 'Pothole',
      description: 'Severe deep road crater posing significant vehicular hazard and potential two-wheeler accidents.',
      severity: 'High',
      priority: 'High',
      confidence: 94,
      recommendedDepartment: 'Road Maintenance',
      reasoning: 'Surface asphalt breakdown exceeds 15cm depth on heavy traffic arterial road. Immediate cold-mix asphalt resurfacing required.',
      estimatedResolutionHours: 24,
    },
  },
  {
    id: 'garbage',
    name: 'Garbage Sample',
    category: 'Garbage',
    title: 'Uncollected Garbage Spill on Pedestrian Footpath',
    description: 'Commercial waste overflowing beyond municipal container onto the walking pavement for over 48 hours.',
    address: '100 Feet Road, 12th Main Junction, Indiranagar, Bengaluru 560038',
    lat: 12.9716,
    lng: 77.6412,
    landmark: 'Near 12th Main Traffic Light',
    zone: 'East Zone - Ward 80',
    imageUrl: SAMPLE_GARBAGE_SVG,
    aiResult: {
      issueCategory: 'Garbage',
      description: 'Massive organic and plastic solid waste buildup blocking pedestrian walkway with foul odor and health risks.',
      severity: 'Medium',
      priority: 'Medium',
      confidence: 91,
      recommendedDepartment: 'Sanitation Department',
      reasoning: 'Secondary collection container overflow. Requires tipper truck dispatch and chemical disinfection of footpath.',
      estimatedResolutionHours: 12,
    },
  },
  {
    id: 'water_leak',
    name: 'Water Leakage Sample',
    category: 'Water Leakage',
    title: 'Potable Water Pipeline Rupture Flooding Road',
    description: 'Underground drinking water main ruptured; clear water gushing continuously causing roadway erosion.',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
    lat: 12.9344,
    lng: 77.6271,
    landmark: 'Behind BDA Complex',
    zone: 'South Zone - Ward 151',
    imageUrl: SAMPLE_WATER_LEAK_SVG,
    aiResult: {
      issueCategory: 'Water Leakage',
      description: 'Pressurized distribution main puncture causing rapid potable water wastage and road foundation weakening.',
      severity: 'Critical',
      priority: 'Urgent',
      confidence: 96,
      recommendedDepartment: 'Water Supply Department',
      reasoning: 'Potable water supply loss exceeds 500 liters/hr. High pressure risks asphalt collapse. Urgent valve isolation required.',
      estimatedResolutionHours: 8,
    },
  },
  {
    id: 'streetlight',
    name: 'Broken Streetlight Sample',
    category: 'Broken Streetlight',
    title: 'Non-Functional LED Streetlight Pole',
    description: 'Streetlight pole dark for 3 consecutive nights leaving a 60-meter curve in complete darkness.',
    address: 'Whitefield Main Road, near Hope Farm Junction, Bengaluru 560066',
    lat: 12.9698,
    lng: 77.7499,
    landmark: 'Hope Farm Circle',
    zone: 'Mahadevapura Zone - Ward 84',
    imageUrl: SAMPLE_STREETLIGHT_SVG,
    aiResult: {
      issueCategory: 'Broken Streetlight',
      description: 'Complete luminaire failure with exposed terminal box wiring at base of pole.',
      severity: 'High',
      priority: 'High',
      confidence: 89,
      recommendedDepartment: 'Electrical Department',
      reasoning: 'Exposed cabling and nighttime pedestrian safety risk near blind road curve. Requires LED driver replacement and grounding check.',
      estimatedResolutionHours: 24,
    },
  },
];
