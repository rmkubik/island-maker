import { parse } from "csv-parse";

function parseCsvText(text) {
  return new Promise((resolve, reject) => {
    const records = [];
    const parser = parse({ relax_column_count: true });

    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
        console.log(record);
      }
    });

    parser.on("error", function (err) {
      console.error(err.message);
      reject(err.message);
    });

    parser.on("end", function () {
      resolve(records);
    });

    parser.write(text);
  });
}

export default parseCsvText;
