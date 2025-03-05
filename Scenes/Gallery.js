class Gallery extends Phaser.Scene {
  constructor() {
    super("GalleryScene");
    this.my = { sprite: {} };
    this.sandScale = .55;
    this.canvas = game.canvas;
    this.canvasCenterX = this.canvas.width/2;
    this.canvasCenterY = this.canvas.height/2;
  }

  preload() {
    //  Load body shape from JSON file generated using the editor
    this.load.json("hitbox", "Scenes/hitbox.json");
    this.load.image("hourglass", "Scenes/hourglass.png");
    this.load.image("sand", "Scenes/sand.png");
    this.load.image("redSand", "Scenes/sandR.png");
    this.load.image("yellowSand", "Scenes/sandY.png");
    this.load.image("blueSand", "Scenes/sandB.png");
  }

  create() {
    this.matter.world.setBounds(0, 0, 900, 700);
    let my = this.my; //Optionally for organizing sprites
    let shapes = this.cache.json.get("hitbox");

    //this.matter.add.image(100, 100, 'glass', null, { shape: shape });
    const glass = this.add.container(this.canvasCenterX, this.canvasCenterY);

    glass.add(this.add.sprite(0, 0, "hourglass"));
    this.matter.add.gameObject(glass, {
        shape: shapes.hourglass,
        isStatic: true,
    });
    glass.setScale(0.55);
    // glass.y = 50;
    glass.setBounce(0.7);

    // Close the top and bottom
    // (doing it in the hourglass collision json breaks it?)
    this.topBarrier = this.matter.add.rectangle(this.canvasCenterX, this.canvasCenterY-260, 380, 80, {
      isStatic: true,
    });
    this.bottomBarrier = this.matter.add.rectangle(this.canvasCenterX, this.canvasCenterY+260, 380, 80, {
        isStatic: true,
      });

    // COLLISION HANDLER FOR TOP/BOTTOM SAND
    this.matter.world.on("collisionactive", (event) => {
      event.pairs.forEach((pair) => {
        let bodyA = pair.bodyA;
        let bodyB = pair.bodyB;

        let sandBody = null;

        //DOWNWARD SAND
        // Identify which body is sand and which is the bottom sensor
        if (bodyA.gameObject?.isDownSand && bodyB === this.bottomSensor) {
          sandBody = bodyA.gameObject;
        } else if (
          bodyB.gameObject?.isDownSand &&
          bodyA === this.bottomSensor
        ) {
          sandBody = bodyB.gameObject;
        }
        
        // UPWARDS SAND
        // Identify which body is sand and which is the top sensor
        if (bodyA.gameObject?.isUpSand && bodyB === this.topSensor) {
          sandBody = bodyA.gameObject;
        } else if (
          bodyB.gameObject?.isUpSand &&
          bodyA === this.topSensor
        ) {
          sandBody = bodyB.gameObject;
        }

        // deletes the sand particle after a delay
        if (sandBody) {
          this.time.delayedCall(1000, () => {
            if (sandBody?.scene) {
              sandBody.destroy();
            }
          });
        }
      });
    });
  }

  update() {
    // chance to make a sand fall down
    if (Phaser.Math.Between(0, 100) < 5) {
      this.genDownwardsSand(this.getRandomSandColor());
    }

    // chance to make a sand fall up
    if (Phaser.Math.Between(0, 100) < 5) {
      this.genUpwardsSand(this.getRandomSandColor());
    }

    // this is to add force to the sand falling upward
    if (this.upwardsSand) {
      this.upwardsSand.forEach((sand) => {
        if (sand.body) {
          this.matter.body.applyForce(sand.body, sand.body.position, {
            x: 0,
            y: -0.0003,
          });
        }
      });
    }
  }

  genDownwardsSand(sandType) {
    let x = Phaser.Math.Between(this.canvasCenterX-110, this.canvasCenterX+110);
    let y = this.canvasCenterY-200;
    let sand = this.matter.add.sprite(x, y, sandType.sprite);
    sand.emotion = sandType.emotion;

    // Set physical properties
    sand.setCircle();
    sand.setFriction(0.1);
    sand.setBounce(0.2);
    sand.setIgnoreGravity(false);
    sand.setScale(this.sandScale);

    // this is for collision detection
    sand.isDownSand = true;

    // Create a bottom sensor (only once, avoids duplicates)
    if (!this.bottomSensor) {
      this.bottomSensor = this.matter.add.rectangle(this.canvasCenterX, this.canvasCenterY+210, 300, 20, {
        isStatic: true,
        isSensor: true,
      });
    }
  }

  genUpwardsSand(sandType) {
    let x = Phaser.Math.Between(this.canvasCenterX-110, this.canvasCenterX+110);
    let y = this.canvasCenterY+200;
    let sand = this.matter.add.sprite(x, y, sandType.sprite);
    sand.emotion = sandType.emotion;

    // Set physical properties
    sand.setCircle();
    sand.setFriction(0.1);
    sand.setBounce(0.2);
    sand.setIgnoreGravity(true);
    sand.setScale(this.sandScale);

    // collision detection
    sand.isUpSand = true;

    // stupid upward sand needs to be stored in an array so its force can be updated in update()
    if (!this.upwardsSand) {
      this.upwardsSand = [];
    }
    this.upwardsSand.push(sand);

    // Create a top sensor (only once, avoids duplicates)
    if (!this.topSensor) {
      this.topSensor = this.matter.add.rectangle(this.canvasCenterX, this.canvasCenterY-210, 300, 20, {
        isStatic: true,
        isSensor: true,
      });
    }
  }

  // fun random color selector
  getRandomSandColor() {
    const sandTypes = [ {sprite: "blueSand", emotion: 0}, {sprite: "yellowSand", emotion: 1}, {sprite: "redSand", emotion: 2}];
    return sandTypes[Math.floor(Math.random() * sandTypes.length)];
  }

  // calculates which grain is changed into the other ones color
  // im sure theres a cleaner way to do this im sorry yall its 5am and im sleepy
  sandColorChange(sand1, sand2) {
    if (sand1.emotion == 0) {           // sand1 = blue | sad
        if (sand2.emotion == 1) {       // sand2 = yellow | happy
            // sand1 wins
            // console.log("sand1 turns to sand2");
        } else if (sand2.emotion == 2) { // sand2 = red | angry
            // sand2 wins
            // console.log("sand2 turns to sand1");
        }
    } else
    if (sand1.emotion == 1) {           // sand1 = yellow | happy
        if (sand2.emotion == 2) {       // sand2 = red | angry
            // sand1 wins
            // console.log("sand1 turns to sand2");
        } else if (sand2.emotion == 0) { // sand2 = blue | sad
            // sand2 wins
            // console.log("sand2 turns to sand1");
        }
    } else
    if (sand1.emotion == 2) {           // sand1 = red | angry
        if (sand2.emotion == 0) {       // sand2 = blue | sad
            // sand1 wins
            // console.log("sand1 turns to sand2");
        } else if (sand2.emotion == 1) { // sand2 = yellow | happy
            // sand2 wins
            // console.log("sand2 turns to sand1");
        }
    }
  }
}
