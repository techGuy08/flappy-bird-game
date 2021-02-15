window.addEventListener("load", function () {
  let canvas = document.getElementById("gameCanvas");
  let ctx = canvas.getContext("2d");
  let isRunning = true;
  let player = {
    x: 30,
    y: 0,
    width: 30,
    height: 30,
    color: "#ff3300",
    score: 0,
    gravity: 6,
    isFall: true,
  };
  let wallBlocksArr = [];
  let wallBlockProp = {
    width: 30,
    color: "#33cc33",
    minHeight: 30,
    gapHeight: 140,
    spaceBetween: 140,
    speed: 2,
  };
  function update() {
    wallBlocksArr.forEach(function (el, i) {
      wallBlocksArr[i].x -= wallBlockProp.speed;
      wallBlocksArr[i].bottomPart.x -= wallBlockProp.speed;
    });
    if (
      wallBlocksArr[wallBlocksArr.length - 1].x <=
      canvas.width - wallBlockProp.spaceBetween
    ) {
      createWallBlock();
    }
    if (player.isFall) {
      player.y += player.gravity;
    } else {
      player.y -= wallBlockProp.gapHeight / 3;
      player.isFall = true;
    }
    for (let i = 0; i < wallBlocksArr.length; i++) {
      if (
        detectCollision(player, wallBlocksArr[i]) ||
        detectCollision(player, wallBlocksArr[i].bottomPart)
      ) {
        isRunning = false;
        break;
      }
    }
    if (
      wallBlocksArr[0].x <= player.x - wallBlockProp.width &&
      !wallBlocksArr[0].isPassed
    ) {
      player.score++;
      wallBlocksArr[0].isPassed = true;
    }
    if (wallBlocksArr[0].x <= -wallBlockProp.width) {
      wallBlocksArr.shift();
    }
    if (player.y >= canvas.height - player.height) {
      isRunning = false;
    }
  }
  function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = wallBlockProp.color;
    wallBlocksArr.forEach(function (el) {
      ctx.fillRect(el.x, el.y, el.width, el.height);
      ctx.fillRect(el.bottomPart.x, el.bottomPart.y, el.width, canvas.height);
    });

    // draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    // draw text
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + player.score, 10, 25);
  }
  function createWallBlock() {
    let randomHeight =
      Math.floor(
        Math.random() *
          (canvas.height - wallBlockProp.minHeight - wallBlockProp.gapHeight)
      ) + wallBlockProp.minHeight;
    let block = {
      x: canvas.width,
      y: 0,
      height: randomHeight,
      width: wallBlockProp.width,
      isPassed: false,
      bottomPart: {
        x: canvas.width,
        y: randomHeight + wallBlockProp.gapHeight,
        width: wallBlockProp.width,
        height: canvas.height,
      },
    };
    wallBlocksArr.push(block);
  }
  function detectCollision(a, b) {
    let w =
      a.x - b.x <= 0
        ? Math.abs(a.x - b.x) <= a.width
        : Math.abs(a.x - b.x) <= b.width;
    let h =
      a.y - b.y <= 0
        ? Math.abs(a.y - b.y) <= a.height
        : Math.abs(a.y - b.y) <= b.height;
    return w && h;
  }

  let frameTimer = setInterval(function () {
    if (!isRunning) {
      return false;
    }
    update();
    draw();
  }, 60);
  function start() {
    createWallBlock();
    update();
    draw();
    setTimeout(function () {
      isRunning = true;
    }, 1000);
  }
  start();
  function jumpUp() {
    if (player.y >= wallBlockProp.gapHeight / 3) {
      player.isFall = false;
    }
  }
  window.addEventListener("keydown", jumpUp);
  window.addEventListener("click", jumpUp);
  // window.addEventListener("keydown", function (e) {
  //   if (e.key == "ArrowRight") {
  //     player.isHmove = true;
  //     player.dirH = "right";
  //   }
  //   if (e.key == "ArrowLeft") {
  //     player.isHmove = true;
  //     player.dirH = "left";
  //   }
  //   if (e.key == "ArrowUp" && player.isOn) {
  //     player.isJumpUp = true;
  //   }
  // });
  // window.addEventListener("keyup", function (e) {
  //   if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
  //     player.isHmove = false;
  //   }
  //   if (e.key == "ArrowUp") {
  //     player.isJumpUp = false;
  //   }
  // });
});
