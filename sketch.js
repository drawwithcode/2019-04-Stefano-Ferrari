var fft;
var shake = false;
var mySongLength;
var timeStamp = 0;
var prevTimeStamp = timeStamp;
var sliderDotX = 0;

function preload() {
  mySong = loadSound("assets/OVERWERK - Anthology (Daft Punk Tribute).mp3");
  guymanuel = loadImage("assets/guymanuel.png");
  thomas = loadImage("assets/thomas.png");
  logo = loadImage("assets/daftpunklogo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  angleMode(DEGREES);
  imageMode(CENTER);

  mySong.playMode('restart');

  //initialize the fft algorithm
  fft = new p5.FFT();
}

function draw() {

  background(0);
  fill(40);
  noStroke();

  //Setting up the background
  var ratio = thomas.width / thomas.height;
  image(thomas, 0, height / 2, height * ratio, height);
  image(guymanuel, width, height / 2, height * ratio, height);

  //variable to analyze the song spectrum
  var spectrum = fft.analyze();

  fill(240);
  textFont('Major Mono Display');
  textAlign(CENTER);
  textSize(20);
  text("oVerWerk - Anthology", width / 2, height / 10);

  //if the song is playing the X coordinate of the marker/dot will increase related to the song timestamp.
  //if the mouse is pressed near the timeline the dot will follow the mouse.
  //if the song is paused the marker/dot will stop.
  if (mySong.isPlaying()) {
    console.log(timeStamp);
    mySongLength = mySong.duration();
    timeStamp = mySong.currentTime();
    sliderDotX = map(timeStamp, 0, mySongLength, width / 3, 2 * width / 3);
  } else if (mouseX > width / 3 &&
    mouseX < 2 * width / 3 &&
    mouseY > height / 1.3 &&
    mouseY < height / 1.1 &&
    mouseIsPressed) {
    sliderDotX = mouseX;
  } else {
    console.log(timeStamp);
    mySongLength = mySong.duration();
    prevTimeStamp = timeStamp;
    sliderDotX = map(prevTimeStamp, 0, mySongLength, width / 3, 2 * width / 3);
  }

  stroke(240);
  //timeline
  line(width / 3, height / 1.2, 2 * width / 3, height / 1.2);
  //marker
  ellipse(sliderDotX, height / 1.2, 10);
  //play button
  triangle(width / 3.15, height / 1.2, width / 3.15 - 15, height / 1.2 + 8, width / 3.15 - 15, height / 1.2 - 8);

  //make the whole animation shake when the bass drop
  var rndX = random(-3, 3);
  var rndY = random(-3, 3);
  if (shake == true) {
    translate(rndX, rndX);
    shake = false;
  }

  //setting the daft punk logo in the middle
  var logoRatio = logo.width / logo.height;
  image(logo, width / 2, height / 2, 150, 150 / logoRatio);

  //going through all the frequencies of the spectrum, the -160 is used to cut the highest frequencies
  for (var i = 0; i < spectrum.length - 160; i += 10) {
    //remapping the height of the audio bars, values under 30 will be set to zero.
    var h = map(spectrum[i], 30, 255, 0, 50);
    if (h < 0) {
      //values under zero are set back to zero
      h = 0;
    }

    //remapping the position within the spectrum in a semicircle
    var x = map(i, 0, spectrum.length - 160, 0, 180);
    //if bass under 15 are higher than 42, shake the animation
    if (x > 2 && x < 25 && h > 40) {
      shake = true;
    }

    push();
    translate(width / 2, height / 2);
    rotate(x + 45);
    //drawing a semicircle with the bars connected to the sound
    line(cos(x) + 100, sin(x) + 100, cos(x) + 100 + h, sin(x) + 100 + h);
    pop();

    var x = map(i, spectrum.length - 160, 0, 180, 360);
    push();
    translate(width / 2, height / 2);
    rotate(x + 45);
    //drawing the other specular half
    line(cos(x) + 100, sin(x) + 100, cos(x) + 100 + h, sin(x) + 100 + h);
    pop();

  }

}

//if the mouse is clicked near the timeline the dot/marker SHOULD follow the mouse and the song SHOULD jump to a new timestamp.
//I WASN'T ABLE TO MAKE THIS WORK PROPERLY SINCE THE .JUMP() CREATE ANOTHER INSTANCE OF THE SONG AND IT LOOKS LIKE THE SONG IS ACTUALLY PAUSED.
function mouseClicked() {
  if (mouseX > width / 3 &&
      mouseX < 2 * width / 3 &&
      mouseY > height / 1.3 &&
      mouseY < height / 1.1) {
    sliderDotX = mouseX;
    mySongLength = mySong.duration();
    var timeStamp = map(sliderDotX, width / 3, 2 * width / 3, 0, mySongLength);
    mySong.jump(timeStamp);
  } else if (mouseX > width / 3.15 - 20 &&
             mouseX < width / 3.15 + 5 &&
             mouseY > height / 1.3 &&
             mouseY < height / 1.1) {
               //If the play button is clicked, the song start and stop
    if (mySong.isPlaying()) {
      mySong.pause();
    } else {
      mySong.loop();
    }
  }
}

//The song can be played and stopped also with the SPACEBAR
function keyTyped() {
  if (keyIsDown(32)) {
    if (mySong.isPlaying()) {
      mySong.pause();
    } else {
      mySong.loop();
    }
  }
}
