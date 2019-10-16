var fft;
var shake = false;

function preload(){
  mySong = loadSound("assets/OVERWERK - Anthology (Daft Punk Tribute).mp3");
  guymanuel = loadImage("assets/guymanuel.png");
  thomas = loadImage("assets/thomas.png");
  logo = loadImage("assets/daftpunklogo.png");
}

function setup() {
  var cnv = createCanvas(windowWidth,windowHeight);
  cnv.mouseClicked(togglePlay);

  angleMode(DEGREES);
  imageMode(CENTER);

  //initialize the fft algorithm
  fft = new p5.FFT();
}

function draw() {

  background(0);

  //Setting the background
  var ratio = thomas.width / thomas.height;
  image(thomas, 0, height/2, height*ratio, height);
  image(guymanuel, width, height/2, height*ratio, height);

  var spectrum = fft.analyze();

  textFont('Major Mono Display');
  textAlign(CENTER);
  textSize(20);
  noStroke();
  fill(240);
  text("click to play Music", width/2, height/10);

  stroke(240);

  //make the animation shake when the bass drop
  var rndX = random(5);
  var rndY = random(5);
  if (shake == true){
    translate(rndX,rndX);
    shake = false;
  }

  //setting the daft punk logo in the middle
  var logoRatio = logo.width/ logo.height;
  image(logo,width/2,height/2,150,150/logoRatio);

  //going through all the frequencies of the spectrum, the -160 is used to cut the highest frequencies
  for (var i = 0; i< spectrum.length-160; i+=10){
    //remapping the height of the audio bars, values under 30 will be set to zero.
    var h = map(spectrum[i], 30, 255, 0, 50);
    if(h<0){
      //values under zero are set back to zero
      h=0;
    }

    //remapping the position within the spectrum in a semicircle
    var x = map(i, 0, spectrum.length-160, 0, 180);
    //if bass under 15 are higher than 42, shake the animation
    if(x<15 && h>42){
      shake=true;
    }

    push();
      translate(width/2,height/2);
      rotate(x+45);
      //drawing a semicircle with the bars connected to the sound
      line(cos(x)+100, sin(x)+100, cos(x)+100+h, sin(x)+100+h);
    pop();

    var x = map(i, spectrum.length-160, 0, 180, 360);
    push();
      translate(width/2,height/2);
      rotate(x+45);
      //drawing the other specular half
      line(cos(x)+100, sin(x)+100, cos(x)+100+h, sin(x)+100+h);
    pop();

  }

}

function togglePlay() {
  if (mySong.isPlaying()) {
    mySong.pause();
  } else {
    mySong.loop();
  }
}
