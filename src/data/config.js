const VISUAL_Y_OFFSET = 120;

// This is an offset needed to get honeycomb
// toPoint function to line up better.
const TOP_MARGIN = 60;

const LOCATION_SIZE = 134;
const HALF_LOCATION_SIZE = LOCATION_SIZE / 2;

const TILE_HEIGHT = 135;
const TILE_IMAGE_HEIGHT = 380;
const LOCATION_Y_OFFSET = TILE_IMAGE_HEIGHT - TILE_HEIGHT - HALF_LOCATION_SIZE;

const TILE_WIDTH = 300;
const TILE_IMAGE_WIDTH = 380;
const LOCATION_X_OFFSET = TILE_IMAGE_WIDTH / 2 - HALF_LOCATION_SIZE;

const dimensions = { width: 10, height: 10 };

export {
  TILE_WIDTH,
  TILE_HEIGHT,
  dimensions,
  TILE_IMAGE_WIDTH,
  TOP_MARGIN,
  LOCATION_Y_OFFSET,
  LOCATION_X_OFFSET,
  VISUAL_Y_OFFSET,
};
