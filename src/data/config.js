const VISUAL_Y_OFFSET = 120;

// This is an offset needed to get honeycomb
// toPoint function to line up better.
const TOP_MARGIN = 51;

const LOCATION_SIZE = 134;
const HALF_LOCATION_SIZE = LOCATION_SIZE / 2;
const LOCATION_TEXT_Y_OFFSET = 65;
const LOCATION_TEXT_X_OFFSET = 62;
const DECK_STACK_INCREMENT = 72;

const TILE_HEIGHT = 135;
const TILE_IMAGE_HEIGHT = 380;
const LOCATION_Y_OFFSET = TILE_IMAGE_HEIGHT - TILE_HEIGHT - HALF_LOCATION_SIZE;

const TILE_WIDTH = 300;
const TILE_IMAGE_WIDTH = 380;
const LOCATION_X_OFFSET = TILE_IMAGE_WIDTH / 2 - HALF_LOCATION_SIZE;

const dimensions = { width: 10, height: 10 };

const GAME_MODE_OPTIONS = {
  SEEDED: "SEEDED",
  EDITOR: "EDITOR",
  PREMADE: "PREMADE",
};

const LOCAL_STORAGE_KEY = "com.ryankubik.island-maker";

const SEED_LENGTH = 8;

/**
 * Change the NETLIFY_URL based on our deploy context (what environment are we running in:)
 * https://docs.netlify.com/site-deploys/overview/#deploy-contexts
 *
 * These are set to the CONTEXT env var in builds (and functions):
 * https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
 */

let NETLIFY_URL;

// Parcel uses NODE_ENV for builds
if (process.env.NODE_ENV === "production") {
  NETLIFY_URL = "https://island-maker.netlify.app";
}

// Netlify sets CONTEXT and URL for builds
switch (process.env.CONTEXT) {
  case "production":
    NETLIFY_URL = process.env.URL;
    break;
  case "deploy-preview":
    /**
     * Get the current deploy preview URL:
     * https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata
     */
    NETLIFY_URL = process.env.DEPLOY_PRIME_URL;
    break;
  default:
    if (!NETLIFY_URL) {
      console.error(
        `This is a deploy context "${process.env.CONTEXT}" that does not have a NETLIFY_URL configured. No network requests will be attempted to Netlify Functions.`
      );
    }
    break;
}

const NETLIFY_FUNCTIONS_PATH = "/.netlify/functions/";
const API_BASE_URL = NETLIFY_URL + NETLIFY_FUNCTIONS_PATH;

let EVENT_API_URL;
if (NETLIFY_URL) {
  const EVENT_API_PATH = "event";
  EVENT_API_URL = API_BASE_URL + EVENT_API_PATH;
}

export {
  TILE_WIDTH,
  TILE_HEIGHT,
  dimensions,
  TILE_IMAGE_WIDTH,
  TOP_MARGIN,
  LOCATION_SIZE,
  LOCATION_TEXT_Y_OFFSET,
  LOCATION_TEXT_X_OFFSET,
  LOCATION_Y_OFFSET,
  LOCATION_X_OFFSET,
  VISUAL_Y_OFFSET,
  DECK_STACK_INCREMENT,
  GAME_MODE_OPTIONS,
  LOCAL_STORAGE_KEY,
  SEED_LENGTH,
  EVENT_API_URL,
};
