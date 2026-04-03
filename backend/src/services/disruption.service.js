const { calculateTotalTime } = require("../utils/calculateTime");
const { getRandomDelay } = require("../utils/helpers");

exports.applyDelay = (routes, manualDelay) => {
  return routes.map((route) => {
    const delay = manualDelay || getRandomDelay();

    const updatedSteps = route.steps.map((step) => {
      if (step.mode === "metro" || step.mode === "bus") {
        return {
          ...step,
          time: step.time + delay,
        };
      }
      return step;
    });

    return {
      ...route,
      steps: updatedSteps,
      totalTime: calculateTotalTime(updatedSteps),
      delay,
    };
  });
};