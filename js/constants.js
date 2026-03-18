export const G = 6.67430e-11;
export const SOLAR_MASS = 1.9885e30;
export const AU = 1.495978707e11;
export const EARTH_RADIUS = 6.371e6;

// unit conversions between physical SI units and scene units
export const DISTANCE_SCALE = AU / 20; // 1 scene unit = ~0.05 AU
export const RADIUS_SCALE = EARTH_RADIUS; // 1 scene radius unit = Earth radius

export const BASE_TIME_STEP_S = 1200; // physical seconds advanced per simulation step
export const DEFAULT_SUBSTEPS = 3;
