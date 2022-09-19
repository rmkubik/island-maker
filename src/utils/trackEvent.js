import packageInfo from "../../package.json";
import { EVENT_API_URL } from "../data/config";
import postData from "./postData";

function trackEvent({ eventName, userId, sessionId, data = {} } = {}) {
  if (!EVENT_API_URL) {
    // If current deploy context has no EVENT_API_URL then
    // we should not try to track anything.
    return;
  }

  const eventData = JSON.stringify(data);

  if (!eventName) {
    console.error("No eventName specified for track event.");
    return;
  }

  if (!userId) {
    console.error("No userId specified for track event.");
    return;
  }

  if (!sessionId) {
    console.error("No sessionId specified for track event.");
    return;
  }

  postData(EVENT_API_URL, {
    userId,
    sessionId,
    appVersion: packageInfo.version,
    appName: packageInfo.name,
    eventName,
    eventData,
  });
}

export default trackEvent;
