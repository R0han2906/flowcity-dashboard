const BASE_URL = 'http://localhost:5000/api';

// ─── Types from the backend ──────────────────────────────────────

export interface BackendRouteStep {
  mode: 'walk' | 'metro' | 'bus' | 'auto' | 'cab' | 'train';
  icon: string;
  label: string;
  duration: number;
  distance: string;
}

export interface BackendRoute {
  id: string;
  label: string;
  type: 'fastest' | 'cheapest' | 'comfort';
  totalTime: number;
  estimatedCost: number;
  confidence: number;
  transfers: number;
  lastMile: string | null;
  steps: BackendRouteStep[];
  requiresCab: boolean;
  tags: string[];
}

export interface RoutePlanResponse {
  source: string;
  destination: string;
  distanceKm: number;
  generatedAt: string;
  routes: BackendRoute[];
}

export interface RawRoute {
  id: number;
  type: string;
  from: string;
  to: string;
  steps: any[];
  delayFactor: number;
  reliability: number;
  confidence: number;
}

export interface DisruptionSimResponse {
  alert: string;
  routes: RawRoute[];
}

// ─── API helpers ─────────────────────────────────────────────────

/** POST /api/route/plan */
export async function planRoute(source: string, destination: string): Promise<RoutePlanResponse> {
  const res = await fetch(`${BASE_URL}/route/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, destination }),
  });
  if (!res.ok) throw new Error(`planRoute failed: ${res.status}`);
  return res.json();
}

/** GET /api/routes */
export async function getAllRoutes(): Promise<RawRoute[]> {
  const res = await fetch(`${BASE_URL}/routes`);
  if (!res.ok) throw new Error(`getAllRoutes failed: ${res.status}`);
  return res.json();
}

/** POST /api/disruption/simulate */
export async function simulateDisruption(delay: number): Promise<DisruptionSimResponse> {
  const res = await fetch(`${BASE_URL}/disruption/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delay }),
  });
  if (!res.ok) throw new Error(`simulateDisruption failed: ${res.status}`);
  return res.json();
}
