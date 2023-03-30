import ReactDOM from "react-dom";
import React, { useCallback, useState } from "react";
import { Chart } from "chart.js/auto";
import { parse } from "csv-parse/lib/sync";
import parseCsvText from "./parseCsvText";

// import data from "../assets/results_2022_11_28.csv";

// console.log(data);

const App = () => {
  const [data, setData] = useState();

  const canvasRef = useCallback((node) => {
    if (node !== null) {
      new Chart(node, {
        type: "bar",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, []);

  return (
    <>
      <h1>Hello world!</h1>
      <div>
        <input
          type="file"
          onChange={(event) => {
            async function readFile(file) {
              const fileString = await file.text();
              console.log(fileString);
              const csvData = await parseCsvText(fileString);

              setData(csvData);
            }

            readFile(event.target.files[0]);
          }}
        />
        <canvas ref={canvasRef}></canvas>
        <pre>{data}</pre>
      </div>
    </>
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
