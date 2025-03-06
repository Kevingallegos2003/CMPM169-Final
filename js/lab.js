

"use strict"
let canvasW = 900;
let canvasH = 700;
let canvasContainer;
var centerHorz, centerVert;


function preload(){

}


function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  canvasW = canvasContainer.width(); // Adjusted for drawing logic
  canvasH = canvasContainer.height(); // Adjusted for drawing logic
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  // let canvas = createCanvas(canvasContainer.width(), 100);
  // canvas.parent("canvas-container");
  // // resize canvas if the page is resized
  // $(window).resize(function() {
  //   resizeScreen();
  // });
  // resizeScreen();


  lastFrame = performance.now(); // returned in milliseconds
  frameTime = 0;
  imageMode(CENTER);
}
// game config
let config = {
    parent: 'canvas-container',
    type: Phaser.CANVAS,
    backgroundColor: '#1b1464',
    render: {
        pixelArt: false  // prevent pixel art from getting blurred when scaled
    },
    physics: {
      default: 'matter',
      matter: {
        // debug: true
        debug: false
      },
    },
    width: 900,
    height: 700,
    fps: { forceSetTimeOut: true, target: 30 },
    scene: [Gallery]
}

const game = new Phaser.Game(config);