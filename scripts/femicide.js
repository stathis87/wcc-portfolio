/* ===
Title: Femicide

This artwork is dadicated to women who lost their life because of gender violence.
 
The purpose of the work is to create a portrait of the 45,000 women who, according to the UN, were victims of gender-based violence in 2021.
My aim is the viewers to see an abstract portrait of a woman through their own image. I chose this material, which is like smoke to represent something intangible that remains in the space like the memory of all the victims.

The 2500 particles that play simultaneously on the screen /projector is the number of new victims in Europe.

The technical aspect of the work have been inspired and followed some tutorials of the Coding Train by Daniel Shiffman:
https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/7-posenet/1-finding-keypoints
&
https://www.youtube.com/watch?v=fBqaA7zRO58

This work have been created for the module Workshop in Creative Coding 1 / Goldsmiths MA Computational Arts

=== */

sm = [];
let video;
let poseNet;
let pose;
let skeleton;
let skeletonCenter;

setup = (_) => {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // ml5
  poseNet = ml5.poseNet(video, "multiple");
  poseNet.on("pose", poseResults);
  frameRate(14);
};

draw = (_) => {
  background(255);
  // Mirror the image to be more friendly for the viewer
  translate(width, 0);
  scale(-1, 1);
  for (let smi of sm) {
    smi.move();
    smi.show();
  }
  for (let i = 0; i < sm.length; i++) {
    sm[i].move();
    sm[i].show();
  }
  if (pose) {
    // Loop and add smoke effect through all the 17 points
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      let r = random(1, 10);
      let s = new Smoke(x, y, r);
      sm.push(s);
      removeSmoke();
    }
    extraPoints();
  }
};

function poseResults(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
};

// Adding extra points to enrich the current posenet skeleton.
function extraPoints() {
  // Distances to calculate the extra points
  // Eye to Eye distance
  let dee = dist(
    pose.leftEye.x,
    pose.leftEye.y,
    pose.rightEye.x,
    pose.rightEye.y
  );
  // Ear to Ear distance
  let dnn = dist(
    pose.rightEar.x,
    pose.rightEar.y,
    pose.leftEar.x,
    pose.leftEar.y
  );
  // Array of extra points
  let points = [
    [pose.nose.x, pose.nose.y - dnn],
    [pose.leftEye.x, pose.leftEye.y + dee],
    [pose.rightEye.x, pose.rightEye.y + dee],
    [pose.nose.x, pose.nose.y + dnn / 2],
    [pose.nose.x, pose.nose.y + dnn],
    [pose.nose.x, pose.nose.y + 2 * dnn],
    [pose.nose.x + dee, pose.nose.y + 2 * dnn],
    [pose.nose.x - dee, pose.nose.y + 2 * dnn],
    [pose.nose.x, pose.nose.y + 3 * dnn],
    [pose.nose.x + dee, pose.nose.y + 3 * dnn],
    [pose.nose.x - dee, pose.nose.y + 3 * dnn],
    [pose.nose.x, pose.nose.y + 4 * dnn],
    [pose.nose.x + dee, pose.nose.y + 4 * dnn],
    [pose.nose.x - dee, pose.nose.y + 4 * dnn],
  ];

  if (pose) {
    for (let i = 0; i < points.length; i++) {
      let x = points[i][0];
      let y = points[i][1];
      let r = random(1, 10);
      let s = new Smoke(x, y, r);
      sm.push(s);
      removeSmoke();
    }
  }
}

// Removes particles from the system to run smoother.
function removeSmoke() {
  if (sm.length > 2500) {
    sm.splice(0, 100);
  }
}

// Smoke
class Smoke {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  move() {
    this.x = this.x + random(-5, 5);
    this.y = this.y + random(-5, 5);
  }
  show() {
    noStroke();
    smooth();
    fill(53, 58, 74, 2);
    ellipse(this.x, this.y, this.r * 3);
  }
};

function keyReleased() {
  if (keyCode == ENTER || keyCode == BACKSPACE) clear();
  if (key == 's' || key == 'S') save("portrait_of_45K.png");
  if (key == 'q' || key == 'Q') noLoop();
  if (key == 'w' || key == 'W') loop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
