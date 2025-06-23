const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];
let i = 0;
let max = 0;

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  input.map((item, idx) => {
    if (max < Number(item)) {
      max = Number(item);
      i = idx + 1;
    }
  });

  console.log(max);
  console.log(i);
  process.exit();
});
