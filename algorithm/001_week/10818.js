const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  const N = Number(input[0]);
  const arr = input[1].split(" ").map(Number);

  const min = Math.min(...arr);
  const max = Math.max(...arr);

  console.log(min, max);
  process.exit();
});
