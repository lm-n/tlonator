var yoff = 0.0;

function preload() {
  pressfunc();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(51);
  fill(255);

  //Floating Graphic
  beginShape();
  var xoff = 0;

  for (var x = 0; x <= width; x += 10) {
    var y = map(noise(xoff, yoff), 0, 1, 200,300);
    vertex(x, y);
    xoff += 0.05;
  }

  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);


  //Text Logic
    textFont("Helvetica");
    textSize(15);
    fill(0);
    text(thetlontext, 100, 340, 500, 350);

    textFont("Helvetica");
    textSize(15);
    fill(0);
    text(finaltext, 700, 340, 500, 350);
  
    textFont("Helvetica");
    textSize(20);
    fill(0);
    text('Tlönized English:', 700, 300, 500, 350);


}

