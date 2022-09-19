const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.PROJECT_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.PROJECT_AWS_SECRET_ACCESS_KEY,
  region: "us-west-1",
});

const db = new aws.DynamoDB();

module.exports = db;
