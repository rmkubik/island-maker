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

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateBody(body) {
  if (!body.userId) {
    throw new ValidationError("userId is not defined!");
  }

  if (!body.sessionId) {
    throw new ValidationError("sessionId is not defined!");
  }

  if (!body.appVersion) {
    throw new ValidationError("appVersion is not defined!");
  }

  if (!body.appName) {
    throw new ValidationError("appName is not defined!");
  }

  if (!body.eventName) {
    throw new ValidationError("eventName is not defined!");
  }
}

exports.handler = async function (event, context) {
  try {
    const { body: bodyString } = event;
    const body = JSON.parse(bodyString);

    validateBody(body);

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

    const response = {
      statusCode: 200,
      message: "OK",
    };

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify(response),
    };
  } catch (err) {
    if (err.name === "ValidationError") {
      const error400 = {
        statusCode: 400,
        message: err.message,
      };

      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow from anywhere
        },
        body: JSON.stringify(error400),
      };
    }

    console.error("Unexpected Error", err);

    const error500 = {
      statusCode: 500,
      message: "ERROR",
    };

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify(error500),
    };
  }
};
