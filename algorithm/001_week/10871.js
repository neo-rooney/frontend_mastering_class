const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  const x = parseInt(input[0].split(" ")[1]);
  const arr = input[1].split(" ").map(Number);

  const answer = arr.filter((item) => item < x).join(" ");
  console.log(answer);
  process.exit();
});
