const routeService = require("../services/route.service");
const disruptionService = require("../services/disruption.service");

exports.simulateDelay = (req, res) => {
  const { delay } = req.body;

  const routes = routeService.getAllRoutes();
  const updatedRoutes = disruptionService.applyDelay(routes, delay);

  res.json({
    alert: "⚠️ Disruption detected",
    routes: updatedRoutes,
  });
};