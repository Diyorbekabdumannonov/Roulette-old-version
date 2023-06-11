let options = [
  "Lose",
  "Lose",
  "Lose",
  "Lose",
  "Lose",
  "$1000000",
  "Lose",
  " 1 Glace",
];

const colors = [
  ["#fff", "#44201f"],
  ["#44201f", "#fff"],
  ["black", "#fff"],
];

let startAngle = 0;
let arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

let ctx;
const spinBtn = document.getElementById("spin");
const marker = document.querySelector(".marker");

spinBtn.addEventListener("click", spin);

function getColor(item) {
  if (item % 2) {
    return "#44201f";
  } else {
    return "#fff";
  }
}

function getFontColor(item) {
  if (item % 2) {
    return "#fff";
  } else {
    return "#44201f";
  }
}

function drawRouletteWheel() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var outsideRadius = 200;
    var textRadius = 160;
    var insideRadius = 0;

    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 4;
    for (var i = 0; i < options.length; i++) {
      var angle = startAngle + i * arc;
      //ctx.fillStyle = colors[i];
      ctx.fillStyle = getColor(i);

      ctx.beginPath();
      ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
      ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();
      ctx.shadowOffsetX = -1;
      ctx.shadowOffsetY = -1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgb(220,220,220)";
      ctx.fillStyle = "black";
      ctx.translate(
        255 + Math.cos(angle + arc / 2) * textRadius,
        250 + Math.sin(angle + arc / 2) * textRadius
      );
      ctx.rotate(angle + arc / 2 - 0.1);
      var text = options[i];

      ctx.font = "20px sans-serif";
      ctx.lineWidth = 1;
      ctx.strokeStyle = getFontColor(i);
      ctx.fillStyle = getFontColor(i);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

      ctx.restore();
    }
  }
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 7;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  var spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;

  const marker = document.querySelector(".marker");

  var degrees = ((startAngle * 180) / Math.PI) % 360;

  options.map((el, index) => {
    const avrg = 360 / options.length;
    if (Math.abs(avrg * (index + 1) - Math.round(degrees)) < 20) {
      marker.classList.add("bounce");
      setTimeout(() => {
        marker.classList.remove("bounce");
      }, 200);
    }
  });

  drawRouletteWheel();
  spinTimeout = setTimeout("rotateWheel()", 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  var degrees = (startAngle * 180) / Math.PI + 90;
  var arcd = (arc * 180) / Math.PI;
  var index = Math.floor((360 - (degrees % 360)) / arcd);
  ctx.save();
  ctx.font = "bold 30px Helvetica, Arial";
  var text = options[index];
  alert(text);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  var ts = (t /= d) * t;
  var tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();
