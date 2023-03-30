import { parse } from "csv-parse";
import { createReadStream } from "fs";

function queryCsv(filePath, query, settings = {}) {
  return new Promise((resolve, reject) => {
    const results = {
      count: 0,
    };
    const parser = parse({ relax_column_count: true, columns: true });

    const readStream = createReadStream(filePath, { encoding: "utf8" })
      .pipe(parser)
      .on("error", function (error) {
        console.log(error.message);
        reject(error);
      })
      .on("data", (record) => {
        results.count += 1;
        query(record, results);
        if (settings.recordLimit && results.count >= settings.recordLimit) {
          readStream.destroy();
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("close", () => {
        resolve(results);
      });
  });
}

export default queryCsv;
