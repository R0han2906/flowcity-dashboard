const { fetchOSRMRoutes, geocode } = require("../services/route.service");

exports.planRoute = async (req, res) => {
  console.log("POST /api/route/plan hit");
  console.log("Request body:", req.body);

  const { source = "", destination = "" } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: "source and destination are required" });
  }

  try {
    const origin = await geocode(source);
    const dest = await geocode(destination);

    const routes = await fetchOSRMRoutes(origin, dest, "driving");

    const scoredRoutes = routes.map((route) => ({
      ...route,
      confidence: route.type === "fastest" ? 92 : route.type === "cheapest" ? 85 : 88,
    }));

    res.json({
      source,
      destination,
      distanceKm: routes[0]?.distanceKm || 0,
      generatedAt: new Date().toISOString(),
      routes: scoredRoutes,
      recommended: {
        routeId: routes[0]?.id || "fastest",
        savedTime: routes.length > 1 ? Math.max(0, Math.round(routes[routes.length - 1].durationMin - routes[0].durationMin)) : 0,
        confidence: 92,
        explanation: `AI recommends the ${routes[0]?.type || "fastest"} route based on current conditions.`,
        insights: {
          timeSaved: routes.length > 1 ? Math.max(0, Math.round(routes[routes.length - 1].durationMin - routes[0].durationMin)) : 0,
          costSaved: routes.length > 1 ? Math.max(0, routes[routes.length - 1].estimatedCost - routes[0].estimatedCost) : 0,
          avoidedTraffic: false,
          predictedDelay: routes[0]?.predictedDelay || 0,
        },
      },
    });
  } catch (err) {
    console.error("Route planning error:", err);
    res.status(500).json({ error: "Failed to plan route. Please try again.", details: err.message });
  }
};
