require("dotenv").config();

const { v4: uuidv4 } = require("uuid");

const db = require("../../functions/db");
const getCurrentUnixEpochString = require("../../functions/getCurrentUnixEpochString");

const EVENTS_TABLE_NAME = "island-maker-events";

async function write(params) {
  return new Promise((resolve, reject) => {
    db.putItem(params, function (err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

exports.handler = async function (event, context) {
  try {
    const { body: bodyString } = event;
    const body = JSON.parse(bodyString);

    const eventGuid = uuidv4();
    const timestamp = getCurrentUnixEpochString();

    const eventParams = {
      TableName: EVENTS_TABLE_NAME,
      Item: {
        EVENT_ID: { S: eventGuid },
        USER_ID: { S: body.userId },
        SESSION_ID: { S: body.sessionId },

        APP_VERSION: { S: body.appVersion },
        APP_NAME: { S: body.appName },

        TIMESTAMP: { S: timestamp },

        EVENT_NAME: { S: body.eventName },
        DATA: { S: body.eventData },
      },
    };

    await write(eventParams);

    return {
      statusCode: 200,
      body: "200 OK",
    };
  } catch (err) {
    console.error("Error", err);

    return {
      statusCode: 500,
      body: "500 ERROR",
    };
  }
};
