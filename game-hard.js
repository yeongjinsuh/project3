
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


//imags
const astronautImg = new Image();
astronautImg.src = 'astronaut.png';

const starImg = new Image();
starImg.src = 'hard.png'

const asteroidImg = new Image();
asteroidImg.src = 'asteroid.png'

const gameOverImg = new Image();
gameOverImg.src = "gameover.png";

const astronaut = {
  x: canvas.width / 2.4,
  y: canvas.height / 1.8,
  width: 128,
  height: 128,
  speed: 4,
  targetRotation: 0,
  rotationSpeed: 8
};

let score = 0;
let gameover = false;
let level = 0;
let objects = [];
let misses = 0; // stars that hit the ground
let maxMisses = 7;


//random number generator for fall speed and spawning positions
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

//keyboard movement, a nd d 
const keys = {};
    window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    });

function collect(a, b) {
  return (

    //collection collision. basically if u touch a star, u collect it.
    a.x < b.x + b.w &&
    a.x + a.width > b.x &&
    a.y < b.y + b.h &&
    a.y + a.height > b.y
  );
}

function update() {


//movement using wasd
const left  = keys['a'] || keys['ArrowLeft'];
const right = keys['d'] || keys['ArrowRight'];
const up    = keys['w'] || keys['ArrowUp'];
const down  = keys['s'] || keys['ArrowDown'];


//rotation of character when moving left and right
let dir = (right ? 1 : 0) - (left ? 1 : 0);

astronaut.x += dir * astronaut.speed;
astronaut.rotation = dir * 20;  // -20, 0, or +20

if (up)   astronaut.y -= 2;
if (down) astronaut.y += 2;

// collison with all borders of canvas
astronaut.x = Math.max(0, Math.min(astronaut.x, canvas.width - astronaut.width));
astronaut.y = Math.max(0, Math.min(astronaut.y, canvas.height - astronaut.height));


 
  //falling stars
  for (let i = objects.length - 1; i >= 0; i--) {
  const obj = objects[i];
  obj.y += obj.fallSpeed * (1 / 60);

  //missing objects, if the top edge of a star has reached the bottom of the canvas, u missed it 
  if (obj.y > canvas.height) {
    misses++;
    objects.splice(i, 1);
//game over screen, also added buttons to allow the player to either retry, or go home.
  if (misses >= maxMisses) {
      gameover = true;

      canvas.style.display = "none";

      document.getElementById("gameover-screen").style.display = "block";
      document.getElementById("retry").style.display = "block";
      document.getElementById("home").style.display = "block";
    }
  }
}


//buttons to go home/retry
document.getElementById("retry").onclick = () => {
    location.reload();
};

document.getElementById("home").onclick = () => {
    window.location.href = "homepage.html"; 
};

//keeps score
for (let i = objects.length - 1; i >= 0; i--) {
  const obj = objects[i];

  if (collect(astronaut, obj)) {
    if (obj.type === "star") {
      // collect star
      score++;
      objects.splice(i, 1);
    } 
  }
}
}



//displaying everything onto the tv screen
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameover) {
    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
    return; 
  }

  for (const obj of objects) {
    let img = obj.type === "asteroid" ? asteroidImg : starImg;
    ctx.drawImage(img, obj.x, obj.y, obj.w, obj.h);
  }

  ctx.save();
  ctx.translate(
    astronaut.x + astronaut.width / 2,
    astronaut.y + astronaut.height / 2
  );
  ctx.rotate(astronaut.rotation * Math.PI / 180);

  ctx.drawImage(
    astronautImg,
    -astronaut.width / 2,
    -astronaut.height / 2,
    astronaut.width,
    astronaut.height
  );

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Stars: " + score, 20, 30);
  ctx.fillText("Misses: " + misses + " / " + maxMisses, 20, 60);
  ctx.fillText("Level: " + level, 20, 90);

  ctx.restore();
}

  
// spawning stars and asteroids, 25% for an asteroid to spawn 
// stars and asterods will increease in speed every level
function spawner() {
   const type = "star";
  
  // saving this incase i actually wanna implement asteroids but for now idk
  // const asteroid = Math.random() < 0.25;
  // const type = asteroid ? "asteroid" : "star";

  const minSpeed = 170;
  const maxSpeed = 190;
  const fallSpeed = randomRange(minSpeed, maxSpeed);

  const size = 110;

  objects.push({
    x: randomRange(0, canvas.width - size),
    y: -size,
    w: size,
    h: size,
    type,
    fallSpeed: randomRange(
      200,
      230
    ),
  });
}


//loop
function loop() {
    update();
    draw();
    
    if (Math.random() < 0.015) {
       spawner();
    }
    requestAnimationFrame(loop);
}

astronautImg.onload = () => loop ();


