import packageInfo from "../../package.json";
import postData from "./postData";

function trackEvent({ eventName, userId, sessionId, data = {} } = {}) {
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

  postData(
    "https://deploy-preview-1--island-maker.netlify.app/.netlify/functions/event",
    {
      userId,
      sessionId,
      appVersion: packageInfo.version,
      appName: packageInfo.name,
      eventName,
      eventData,
    }
  );
}

export default trackEvent;
