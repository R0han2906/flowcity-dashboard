const BASE_URL = 'http://localhost:5000/api';

export interface RouteResource {
  type: 'walk' | 'metro' | 'bus' | 'train' | 'cab' | 'auto';
  duration: number;
  label: string;
}

export interface BackendRoute {
  id: string;
  type: 'fastest' | 'cheapest' | 'comfort';
  label: string;
  durationMin: number;
  estimatedCost: number;
  confidence: number;
  transfers: number;
  tags: string[];
  trafficLevel: "low" | "medium" | "high";
  predictedDelay: number;
  geometry: [number, number][];
  distanceKm: number;
  resources: RouteResource[];
}

export interface AIRecommendation {
  routeId: string;
  savedTime: number;
  confidence: number;
  explanation: string;
  insights: {
    timeSaved: number;
    costSaved: number;
    avoidedTraffic: boolean;
    predictedDelay: number;
  };
}

export interface RoutePlanResponse {
  source: string;
  destination: string;
  distanceKm: number;
  generatedAt: string;
  routes: BackendRoute[];
  recommended: AIRecommendation;
}

export async function planRoute(source: string, destination: string): Promise<RoutePlanResponse> {
  const res = await fetch(`${BASE_URL}/route/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, destination }),
  });
  if (!res.ok) throw new Error(`planRoute failed: ${res.status}`);
  const data = await res.json();
  return data as RoutePlanResponse;
}

export async function simulateDisruption(delay: number): Promise<any> {
  const res = await fetch(`${BASE_URL}/disruption/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delay }),
  });
  if (!res.ok) throw new Error(`simulateDisruption failed: ${res.status}`);
  return res.json();
}

export async function getAllRoutes(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/routes`);
  if (!res.ok) throw new Error(`getAllRoutes failed: ${res.status}`);
  return res.json();
}
