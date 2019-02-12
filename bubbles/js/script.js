function randomNumberFromTo(from, to) {
  return Math.floor(Math.random() * (to + 1 - from)) + from;
}

function removePoppedBubbles() {
  var bubbles = document.getElementsByClassName('popped');
  for (var i = bubbles.length - 1; i >= 0; i--) {
    document.body.removeChild(bubbles[i]);
  }
}

function popAllBubbles() {
  setTimeout(createBubbles, 1);
  var bubbles = document.getElementsByClassName('bubble');
  for (var i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].classList.add('popped');
  }
  setTimeout(removePoppedBubbles, 3000);
}

function createBubble(rFrom, rTo, gFrom, gTo, bFrom, bTo) {
  var bubble = document.createElement("div");
  bubble.classList.add('bubble');
  bubble.style.left = randomNumberFromTo(-15, 85) + "%";
  bubble.style.top = randomNumberFromTo(-15, 85) + "%";

  var r = randomNumberFromTo(rFrom, rTo);
  var g = randomNumberFromTo(gFrom, gTo);
  var b = randomNumberFromTo(bFrom, bTo);

  var size = randomNumberFromTo(150, 500);
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";

  bubble.style.backgroundColor = "rgba(" + r + "," + g + "," + b + ", 0.3)";
  bubble.style.borderColor = "rgba(" + r + "," + g + "," + b + ", 0.5)";

  document.body.appendChild(bubble);
}

function createBubbles() {
  var rFrom = randomNumberFromTo(0, 120);
  var rTo = randomNumberFromTo(rFrom, 255);
  var gFrom = randomNumberFromTo(0, 120);
  var gTo = randomNumberFromTo(gFrom, 255);
  var bFrom = randomNumberFromTo(0, 120);
  var bTo = randomNumberFromTo(bFrom, 255);

  var create = setInterval(function() {
    createBubble(rFrom, rTo, gFrom, gTo, bFrom, bTo);
  }, 300);

  setTimeout(function() {
    clearInterval(create);
  }, 10000);

  setTimeout(popAllBubbles, 25000);
}

popAllBubbles();

