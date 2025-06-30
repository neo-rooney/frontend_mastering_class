const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  const [n, ...results] = input;
  for (let i = 0; i < results.length; i++) {
    let sum = 0;
    let score = 0;
    for (let j = 0; j < results[i].length; j++) {
      if (results[i][j] === "O") {
        sum += ++score;
      } else {
        score = 0;
      }
    }
    console.log(sum);
  }
  process.exit();
});
