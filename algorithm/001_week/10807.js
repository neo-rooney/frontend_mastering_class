const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  const v = input[2];
  const arr = input[1].split(" ");
  let cnt = 0;
  arr.forEach((item) => item === v && cnt++);

  console.log(cnt);
  process.exit();
});
