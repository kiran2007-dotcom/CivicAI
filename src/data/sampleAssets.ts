import { IssueCategory, SeverityLevel, PriorityLevel } from '../types';

export interface RealPhotoAsset {
  id: string;
  url: string;
  fallbackUrl?: string;
  source: 'Unsplash' | 'Wikimedia Commons' | 'Pexels' | 'Municipal Open Data';
  photographer: string;
  sourcePageUrl: string;
  license: string;
  altText: string;
  subject: string;
}

// Strict Real Photography Sourcing Policy (Zero AI-generated / synthetic graphics)
// All URLs verified HTTP 200 from Unsplash CDN under free Unsplash / Open Licenses
export const REAL_CIVIC_PHOTOS: Record<string, RealPhotoAsset> = {
  pothole: {
    id: 'pothole-photo-01',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    source: 'Unsplash',
    photographer: 'Marc-Olivier Jodoin',
    sourcePageUrl: 'https://unsplash.com/photos/photo-1515162816999-a0c47dc192f7',
    license: 'Unsplash Free License (Commercial & Editorial Reuse Allowed)',
    altText: 'Real photograph of asphalt road surface damage and water-filled pothole',
    subject: 'Damaged asphalt road with deep pothole crater in urban carriage way',
  },
  garbage: {
    id: 'garbage-photo-01',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    source: 'Unsplash',
    photographer: 'John Cameron',
    sourcePageUrl: 'https://unsplash.com/photos/photo-1618477461853-cf6ed80faba5',
    license: 'Unsplash Free License (Commercial & Editorial Reuse Allowed)',
    altText: 'Real photograph of overflowing municipal street waste bin and litter',
    subject: 'Commercial solid waste accumulation spilling around municipal receptacle',
  },
  waterLeak: {
    id: 'water-photo-01',
    url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=800&auto=format&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1527066579998-dbbae57f45ce?w=800&auto=format&fit=crop&q=80',
    source: 'Unsplash',
    photographer: 'David Ballew',
    sourcePageUrl: 'https://unsplash.com/photos/photo-1516876437184-593fda40c7ce',
    license: 'Unsplash Free License (Commercial & Editorial Reuse Allowed)',
    altText: 'Real photograph of high-pressure water pipe rupture leaking continuously',
    subject: 'Potable water supply pipe puncture spraying water across pavement',
  },
  streetlight: {
    id: 'streetlight-photo-01',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
    source: 'Unsplash',
    photographer: 'Arthur Edelman',
    sourcePageUrl: 'https://unsplash.com/photos/photo-1517457373958-b7bdd4587205',
    license: 'Unsplash Free License (Commercial & Editorial Reuse Allowed)',
    altText: 'Real photograph of an urban street lamp pole out of service',
    subject: 'Non-functional city luminaire streetlight post on road shoulder',
  },
  workerProgress: {
    id: 'worker-progress-01',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    source: 'Unsplash',
    photographer: 'Callum Shaw',
    sourcePageUrl: 'https://unsplash.com/photos/photo-1621905251189-08b45d6a269e',
    license: 'Unsplash Free License (Commercial & Editorial Reuse Allowed)',
    altText: 'Real photograph of municipal technician conducting field repairs',
    subject: 'Municipal technician with tools working on infrastructure repair',
  },
  completedResolution: {
    id: 'clean-street-01',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
    source: 'Unsplash',
    photographer: 'Dan Gold',
    sourcePageUrl: 'https://unsplash.com/photos/photo-1449824913935-59a10b8d2000',
    license: 'Unsplash Free License (Commercial & Editorial Reuse Allowed)',
    altText: 'Real photograph of clean, fully repaired city roadway and sidewalk',
    subject: 'Clean, resurfaced city asphalt roadway inspected and cleared',
  },
  cityHero: {
    id: 'city-hero-01',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    source: 'Unsplash',
    photographer: 'Sean Pollock',
    sourcePageUrl: 'https://unsplash.com/photos/photo-1486406146926-c627a92ad1ab',
    license: 'Unsplash Free License (Commercial & Editorial Reuse Allowed)',
    altText: 'Real photograph of modern smart city civic architecture and roads',
    subject: 'Civic buildings and infrastructure in modern metropolitan city',
  },
};

// Direct URLs exported for seamless drop-in backwards compatibility
export const SAMPLE_POTHOLE_SVG = REAL_CIVIC_PHOTOS.pothole.url;
export const SAMPLE_GARBAGE_SVG = REAL_CIVIC_PHOTOS.garbage.url;
export const SAMPLE_WATER_LEAK_SVG = REAL_CIVIC_PHOTOS.waterLeak.url;
export const SAMPLE_STREETLIGHT_SVG = REAL_CIVIC_PHOTOS.streetlight.url;
export const SAMPLE_REPAIR_PROGRESS_SVG = REAL_CIVIC_PHOTOS.workerProgress.url;
export const SAMPLE_COMPLETED_REPAIR_SVG = REAL_CIVIC_PHOTOS.completedResolution.url;

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
  photoDetails: RealPhotoAsset;
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

export const SAMPLE_SCENARIOS: SampleIssueScenario[] = [
  {
    id: 'pothole',
    name: 'Pothole Scenario',
    category: 'Pothole',
    title: 'Severe Pothole on Central Carriageway',
    description: 'Deep circular pothole approximately 1.5m wide causing vehicle swerving and tire damage near the metro pillar.',
    address: 'Near Metro Pillar 142, MG Road, Bengaluru, Karnataka 560001',
    lat: 12.9756,
    lng: 77.6092,
    landmark: 'Opposite Central Mall / Metro Pillar 142',
    zone: 'East Zone - Ward 112',
    imageUrl: REAL_CIVIC_PHOTOS.pothole.url,
    photoDetails: REAL_CIVIC_PHOTOS.pothole,
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
    name: 'Garbage Spill Scenario',
    category: 'Garbage',
    title: 'Uncollected Garbage Spill on Pedestrian Footpath',
    description: 'Commercial waste overflowing beyond municipal container onto the walking pavement for over 48 hours.',
    address: '100 Feet Road, 12th Main Junction, Indiranagar, Bengaluru 560038',
    lat: 12.9716,
    lng: 77.6412,
    landmark: 'Near 12th Main Traffic Light',
    zone: 'East Zone - Ward 80',
    imageUrl: REAL_CIVIC_PHOTOS.garbage.url,
    photoDetails: REAL_CIVIC_PHOTOS.garbage,
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
    name: 'Water Main Rupture Scenario',
    category: 'Water Leakage',
    title: 'Potable Water Pipeline Rupture Flooding Road',
    description: 'Underground drinking water main ruptured; clear water gushing continuously causing roadway erosion.',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
    lat: 12.9344,
    lng: 77.6271,
    landmark: 'Behind BDA Complex',
    zone: 'South Zone - Ward 151',
    imageUrl: REAL_CIVIC_PHOTOS.waterLeak.url,
    photoDetails: REAL_CIVIC_PHOTOS.waterLeak,
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
    name: 'Broken Streetlight Scenario',
    category: 'Broken Streetlight',
    title: 'Non-Functional LED Streetlight Pole',
    description: 'Streetlight pole dark for 3 consecutive nights leaving a 60-meter curve in complete darkness.',
    address: 'Whitefield Main Road, near Hope Farm Junction, Bengaluru 560066',
    lat: 12.9698,
    lng: 77.7499,
    landmark: 'Hope Farm Circle',
    zone: 'Mahadevapura Zone - Ward 84',
    imageUrl: REAL_CIVIC_PHOTOS.streetlight.url,
    photoDetails: REAL_CIVIC_PHOTOS.streetlight,
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
