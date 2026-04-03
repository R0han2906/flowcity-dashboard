/**
 * POST /api/route/plan
 * Accepts { source, destination } and returns 3 AI-simulated route options.
 * Routes are deterministically varied based on the input but feel realistic.
 */
exports.planRoute = (req, res) => {
  const { source = "", destination = "" } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: "source and destination are required" });
  }

  // Deterministic seed from combined string length + char codes
  const combinedStr = `${source}${destination}`.toLowerCase();
  let seed = 0;
  for (let i = 0; i < combinedStr.length; i++) {
    seed = (seed * 31 + combinedStr.charCodeAt(i)) % 100;
  }

  // Derive realistic variability: 0-9 range
  const variance = seed % 10;

  // Distance estimate (km): 8–35 km range
  const distKm = 8 + ((source.length * 3 + destination.length * 2 + seed) % 27);

  // ── Fastest Route: Metro-heavy ──────────────────────────────
  const fastestMetroTime = Math.round(distKm * 1.8 + variance * 0.5);  // ~14-45 min
  const fastestAutoTime  = 5 + (variance % 5);
  const fastestTotalTime = 2 + fastestMetroTime + fastestAutoTime; // walk + metro + auto
  const fastestCost      = 40 + Math.round(distKm * 2.5) + variance;

  // ── Cheapest Route: Bus + Walk ──────────────────────────────
  const cheapestBusTime   = Math.round(distKm * 2.7 + variance * 1.2);
  const cheapestTrainTime = Math.round(distKm * 0.6 + 5);
  const cheapestTotalTime = 5 + cheapestBusTime + cheapestTrainTime;
  const cheapestCost      = 10 + Math.round(distKm * 0.8) + (variance % 5);

  // ── Comfort Route: Direct Cab ───────────────────────────────
  const comfortCabTime   = Math.round(distKm * 2.2 + variance * 0.8);
  const comfortTotalTime = comfortCabTime;
  const comfortCost      = 80 + Math.round(distKm * 9) + variance * 4;

  // ── Last-mile distances (dynamic) ──────────────────────────
  const lastMileKm = (0.8 + (variance % 7) * 0.3).toFixed(1);

  const routes = [
    {
      id: "fastest",
      label: "⚡ Fastest",
      type: "fastest",
      totalTime: fastestTotalTime,
      estimatedCost: fastestCost,
      confidence: 94 + (variance % 5),
      transfers: 2,
      lastMile: `Auto recommended for last ${lastMileKm} km`,
      steps: [
        {
          mode: "walk",
          icon: "🚶",
          label: "Walk to Metro Station",
          duration: 2,
          distance: "0.2 km",
        },
        {
          mode: "metro",
          icon: "🚇",
          label: `Metro (Line ${1 + (seed % 4)})`,
          duration: fastestMetroTime,
          distance: `${Math.round(distKm * 0.75)} km`,
        },
        {
          mode: "auto",
          icon: "🛺",
          label: "Auto Rickshaw",
          duration: fastestAutoTime,
          distance: `${lastMileKm} km`,
        },
      ],
      requiresCab: false,
      tags: ["Fastest", "AI Pick"],
    },
    {
      id: "cheapest",
      label: "💸 Cheapest",
      type: "cheapest",
      totalTime: cheapestTotalTime,
      estimatedCost: cheapestCost,
      confidence: 80 + (variance % 8),
      transfers: 3,
      lastMile: null,
      steps: [
        {
          mode: "walk",
          icon: "🚶",
          label: "Walk to Bus Stop",
          duration: 5,
          distance: "0.5 km",
        },
        {
          mode: "bus",
          icon: "🚌",
          label: `Bus Route ${300 + (seed % 50)}`,
          duration: cheapestBusTime,
          distance: `${Math.round(distKm * 0.6)} km`,
        },
        {
          mode: "train",
          icon: "🚆",
          label: "Local Train",
          duration: cheapestTrainTime,
          distance: `${Math.round(distKm * 0.35)} km`,
        },
        {
          mode: "walk",
          icon: "🚶",
          label: "Walk to destination",
          duration: 5,
          distance: "0.4 km",
        },
      ],
      requiresCab: false,
      tags: ["Budget", "Eco-Friendly"],
    },
    {
      id: "comfort",
      label: "😌 Comfort",
      type: "comfort",
      totalTime: comfortTotalTime,
      estimatedCost: comfortCost,
      confidence: 88 + (variance % 8),
      transfers: 0,
      lastMile: null,
      steps: [
        {
          mode: "cab",
          icon: "🚗",
          label: "Cab (AC, Direct)",
          duration: comfortTotalTime,
          distance: `${distKm} km`,
        },
      ],
      requiresCab: true,
      tags: ["Zero Transfers", "Door to Door"],
    },
  ];

  res.json({
    source,
    destination,
    distanceKm: distKm,
    generatedAt: new Date().toISOString(),
    routes,
  });
};
