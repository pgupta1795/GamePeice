import component from "./component.js";

$(document).ready(function () {

  var myGameArea = {
    canvas: $("#myCanvas")[0],

    start: function () {
      this.canvas.width = 480;
      this.canvas.height = 270;
      this.context = this.canvas.getContext("2d");
      this.frameNo = 0;
    },

    update: function () {
      this.interval = setInterval(updateGameArea, 20);
    },

    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop: function () {
      clearInterval(this.interval);
    }
  }

  var myGamePiece = new component(30, 30, "red", 10, 120, undefined, myGameArea);
  var myObstacles = [];
  var myScore = new component("30px", "Consolas", "black", 280, 40, "text", myGameArea);
  myGameArea.start();
  myGameArea.update();

  function checkCollision(myObstacles, myGamePiece, myGameArea) {
    for (var i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
        myGameArea.stop();
        return;
      }
    }
  }

  function createObstacles(myObstacles, myGameArea) {
    var checkInterval = (myGameArea.frameNo / 150) % 1 == 0 ? true : false;

    if (myGameArea.frameNo == 1 || checkInterval) {
      var obstacleColor = "green";
      var x = myGameArea.canvas.width;
      var minHeight = 20;
      var maxHeight = 200;
      var height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      var minGap = 50;
      var maxGap = 200;
      var gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

      myObstacles.push(new component(10, height, obstacleColor, x, 0, undefined, myGameArea));
      myObstacles.push(new component(10, x - height - gap, obstacleColor, x, height + gap, undefined, myGameArea));
    }
    for (var i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].speedX = -1;
      myObstacles[i].newPos();
      myObstacles[i].update();
    }
  }

  function updateGameArea() {
    checkCollision(myObstacles, myGamePiece, myGameArea);
    myGameArea.clear();
    myGameArea.frameNo += 1;
    createObstacles(myObstacles, myGameArea);
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
  }

  $("#up").mousedown(function () {
    myGamePiece.speedY -= 1;
  });

  $("#down").mousedown(function () {
    myGamePiece.speedY += 1;
  });

  $("#left").mousedown(function () {
    myGamePiece.speedX -= 1;
  });

  $("#right").mousedown(function () {
    myGamePiece.speedX += 1;
  });

  $(".stopButton").mouseup(function () {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
  });

});