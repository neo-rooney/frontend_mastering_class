const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let input = [];

rl.on("line", function (line) {
  input.push(line);
}).on("close", function () {
  const n = Number(input[0]);
  // 입력값 input[1]에서 최대값 구하기
  const scores = input[1].split(" ").map(Number);
  const M = Math.max(...scores);
  // 나머지 값은 점수/M * 100
  const newScores = scores.map((score) => (score / M) * 100);

  // 새로운 평균구하기
  const sum = newScores.reduce((acc, curr) => acc + curr);
  const average = sum / n;
  console.log(average);
  process.exit();
});
