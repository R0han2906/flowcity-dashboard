const routes = require("../data/routes.json");

const { calculateTotalTime } = require("../utils/calculateTime");
const { calculateTotalCost } = require("../utils/calculateCost");

exports.getAllRoutes = () => {
  return routes.map((route) => {
    const totalTime = calculateTotalTime(route.steps);
    const totalCost = calculateTotalCost(route.steps);

    return {
      ...route,
      totalTime,
      totalCost,
      delay: 0,
      crowd: 0,
    };
  });
};