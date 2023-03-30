import { parse } from "csv-parse";

function queryCsvText(text, query) {
  return new Promise((resolve, reject) => {
    const results = {};
    const parser = parse({ relax_column_count: true });

    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        query(record, results);
      }
    });

    parser.on("error", function (err) {
      console.error(err.message);
      reject(err.message);
    });

    parser.on("end", function () {
      console.log("parsing end");
      resolve(results);
    });

    parser.write(text);
  });
}

export default queryCsvText;
