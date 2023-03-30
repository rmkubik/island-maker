/**
 *  node tasks/queryCsv.js <csv path> <record count>
 *  ex. node tasks/queryCsv.js assets/results_2022_11_28.csv 100
 */

// APP_VERSION,DATA,USER_ID,SESSION_ID,EVENT_NAME,APP_NAME,TIMESTAMP,EVENT_ID

import queryCsv from "../src/queryCsv.js";
import median from "../utils/median.js";
import attachRkPrototypes from "../utils/attachRkPrototypes.js";

attachRkPrototypes();

async function run() {
  try {
    const userQuery = await queryCsv(
      process.argv[2],
      (record, results) => {
        if (record.APP_VERSION !== "3.0.0") {
          return;
        }

        if (!results.users) {
          results.users = {};
        }

        results.users[record.USER_ID] = {
          eventTypes: {},
          sessions: {},
        };
      },
      { recordLimit: process.argv[3] }
    );

    const uniqueUserCount = Object.keys(userQuery.users).length;
    console.log("unique user count:", uniqueUserCount);

    const csvData = await queryCsv(
      process.argv[2],
      (record, results) => {
        if (record.APP_VERSION !== "3.0.0") {
          return;
        }

        let eventData;

        try {
          eventData = JSON.parse(record.DATA);
        } catch (err) {
          eventData = {};
        }

        if (!userQuery.users[record.USER_ID].eventTypes[record.EVENT_NAME]) {
          userQuery.users[record.USER_ID].eventTypes[record.EVENT_NAME] = {};
        }

        if (record.EVENT_NAME === "levelPicked") {
          if (
            !userQuery.users[record.USER_ID].eventTypes.levelPicked[
              eventData.level
            ]
          ) {
            userQuery.users[record.USER_ID].eventTypes.levelPicked[
              eventData.level
            ] = 0;
          }

          userQuery.users[record.USER_ID].eventTypes.levelPicked[
            eventData.level
          ] += 1;
        }

        //

        if (!userQuery.users[record.USER_ID].sessions[record.SESSION_ID]) {
          userQuery.users[record.USER_ID].sessions[record.SESSION_ID] = {
            earliestTimeStamp: undefined,
            latestTimeStamp: undefined,
          };
        }

        // const currentTime = new Date(record.TIMESTAMP);

        if (
          !userQuery.users[record.USER_ID].sessions[record.SESSION_ID]
            .earliestTimeStamp
        ) {
          userQuery.users[record.USER_ID].sessions[
            record.SESSION_ID
          ].earliestTimeStamp = record.TIMESTAMP;
        }

        if (
          record.TIMESTAMP <
          userQuery.users[record.USER_ID].sessions[record.SESSION_ID]
            .earliestTimeStamp
        ) {
          userQuery.users[record.USER_ID].sessions[
            record.SESSION_ID
          ].earliestTimeStamp = record.TIMESTAMP;
        }

        if (
          !userQuery.users[record.USER_ID].sessions[record.SESSION_ID]
            .latestTimeStamp
        ) {
          userQuery.users[record.USER_ID].sessions[
            record.SESSION_ID
          ].latestTimeStamp = record.TIMESTAMP;
        }

        if (
          record.TIMESTAMP >
          userQuery.users[record.USER_ID].sessions[record.SESSION_ID]
            .latestTimeStamp
        ) {
          userQuery.users[record.USER_ID].sessions[
            record.SESSION_ID
          ].latestTimeStamp = record.TIMESTAMP;
        }

        //

        if (!results.eventTypes) {
          results.eventTypes = {};
        }

        if (!results.eventTypes[record.EVENT_NAME]) {
          results.eventTypes[record.EVENT_NAME] = { count: 0 };
        }

        results.eventTypes[record.EVENT_NAME].count += 1;

        //

        if (!results.version) {
          results.version = {};
        }

        if (!results.version[record.APP_VERSION]) {
          results.version[record.APP_VERSION] = 0;
        }

        results.version[record.APP_VERSION] += 1;

        //

        if (!results.levels) {
          results.levels = {};
        }

        if (eventData.level) {
          if (!results.levels[eventData.level]) {
            results.levels[eventData.level] = {
              picked: 0,
              retried: 0,
              over: 0,
            };
          }

          switch (record.EVENT_NAME) {
            case "levelPicked":
              results.levels[eventData.level].picked += 1;
              break;
            case "levelRetried":
              results.levels[eventData.level].retried += 1;
              break;
            case "levelOver":
              results.levels[eventData.level].over += 1;
              break;
            default:
              break;
          }
        }
      },
      { recordLimit: process.argv[3] }
    );

    console.log(csvData);

    const usersWhoTriggeredAppLoaded = Object.values(userQuery.users).reduce(
      (count, current) => {
        if (current.eventTypes.appLoaded !== undefined) {
          return count + 1;
        }

        return count;
      },
      0
    );

    console.log(
      "unique users who triggered app loaded",
      usersWhoTriggeredAppLoaded
    );

    const levelsLoadedByUniqueUser = Object.values(userQuery.users).reduce(
      (levels, user) => {
        if (user.eventTypes.levelPicked) {
          Object.keys(user.eventTypes.levelPicked).forEach((level) => {
            if (!levels[level]) {
              levels[level] = 0;
            }

            levels[level] += 1;
          });
        }

        return levels;
      },
      {}
    );

    console.log(levelsLoadedByUniqueUser);

    const calcUserSessionCount = (user) => {
      return Object.values(user.sessions).length;
    };

    const userSessionCounts = Object.values(userQuery.users).map(
      calcUserSessionCount
    );
    const totalSessions = userSessionCounts.rkSum();

    const calcUserPlayTime = (user) => {
      return Object.values(user.sessions).reduce((totalPlayTime, session) => {
        if (!session.earliestTimeStamp || !session.latestTimeStamp) {
          // Session doesn't have enough info to calculate length
          return totalPlayTime;
        }

        const sessionLength =
          session.latestTimeStamp - session.earliestTimeStamp;

        return totalPlayTime + sessionLength;
      }, 0);
    };

    const sumUserPlayTime = (allUsersPlaytime, user) => {
      return allUsersPlaytime + calcUserPlayTime(user);
    };

    const userPlaytimes = Object.values(userQuery.users).map(calcUserPlayTime);
    const medianUserPlaytime = median(
      userPlaytimes.filter((playTime) => playTime !== 0)
    );

    const totalSecondsPlayed = Object.values(userQuery.users).reduce(
      sumUserPlayTime,
      0
    );
    const totalMinutesPlayed = totalSecondsPlayed / 60;
    const totalHoursPlayed = totalMinutesPlayed / 60;
    const totalDaysPlayed = totalHoursPlayed / 24;

    console.log({
      uniqueUserCount,
      totalSessions,
      averageSessionsPerUser: parseFloat(
        (totalSessions / uniqueUserCount).toFixed(2)
      ),
      medianSessionsPerUser: userSessionCounts.rkMedian().rkToFixedFloat(2),
      totalDaysPlayed: parseFloat(totalDaysPlayed.toFixed(2)),
      averageMinutesPerUser: parseFloat(
        (totalMinutesPlayed / uniqueUserCount).toFixed(2)
      ),
      averageHoursPerUser: parseFloat(
        (totalHoursPlayed / uniqueUserCount).toFixed(2)
      ),
      medianMinutesPerUser: parseFloat((medianUserPlaytime / 60).toFixed(2)),
      medianHoursPerUser: parseFloat((medianUserPlaytime / 60 / 60).toFixed(2)),
    });

    const uniqueUsersWhoPlayedDaily = Object.values(userQuery.users).reduce(
      (users, user) => {
        if (user.eventTypes.levelPicked?.daily !== undefined) {
          return [...users, user];
        }

        return users;
      },
      []
    );
    const uniqueDailyUserCount = uniqueUsersWhoPlayedDaily.length;

    const dailyUserSessionCounts = Object.values(uniqueUsersWhoPlayedDaily).map(
      calcUserSessionCount
    );
    const totalDailySessions = dailyUserSessionCounts.rkSum();

    const dailyUserPlaytimes = Object.values(uniqueUsersWhoPlayedDaily).map(
      calcUserPlayTime
    );
    const medianDailyUserPlaytimes = median(
      dailyUserPlaytimes.filter((playTime) => playTime !== 0)
    );
    const totalDailySecondsPlayed = Object.values(
      uniqueUsersWhoPlayedDaily
    ).reduce(sumUserPlayTime, 0);
    const totalDailyMinutesPlayed = totalDailySecondsPlayed / 60;
    const totalDailyHoursPlayed = totalDailyMinutesPlayed / 60;
    const totalDailyDaysPlayed = totalDailyHoursPlayed / 24;

    console.log({
      uniqueUsersWhoPlayedDaily: uniqueDailyUserCount,
      totalDailySessions,
      averageSessionsPerUser: (
        totalDailySessions / uniqueDailyUserCount
      ).rkToFixedFloat(2),
      medianSessionsPerUser: dailyUserSessionCounts
        .rkMedian()
        .rkToFixedFloat(2),
      totalDaysPlayed: totalDailyDaysPlayed.rkToFixedFloat(2),
      averageMinutesPerUser: (
        totalDailyMinutesPlayed / uniqueDailyUserCount
      ).rkToFixedFloat(2),
      averageHoursPerUser: (
        totalDailyHoursPlayed / uniqueDailyUserCount
      ).rkToFixedFloat(2),
      medianMinutesPerUser: (medianDailyUserPlaytimes / 60).rkToFixedFloat(2),
      medianHoursPerUser: (medianDailyUserPlaytimes / 60 / 60).rkToFixedFloat(
        2
      ),
    });

    //
  } catch (err) {
    console.log(err);
  }
}

run();
