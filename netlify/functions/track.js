require("dotenv").config();

const { v4: uuidv4 } = require("uuid");

const db = require("../../functions/db");
const getCurrentUnixEpochString = require("../../functions/getCurrentUnixEpochString");

const params = {
  TableName: "island-maker-events",
  Item: {
    EVENT_ID: { S: uuidv4() },
    USER_ID: { S: "c025451e-e5a5-49cb-a280-845d7e723d61" },
    SESSION_ID: { S: "test" },

    APP_VERSION: { S: "0.0.1" },
    APP_NAME: { S: "com.ryankubik.island-maker" },

    TIMESTAMP: { S: getCurrentUnixEpochString() },

    EVENT_NAME: { S: "playerDidPlace" },
    DATA: { S: '{ "test": "hello world" }' },
  },
};

// db.putItem(params, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data);
//   }
// });

exports.handler = async function (event, context) {
  // Call DynamoDB to add the item to the table
  db.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }),
  };
};
