class Gallery extends Phaser.Scene {
  constructor() {
    super("GalleryScene");
    this.my = { sprite: {} };
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
    const glass = this.add.container(400, 450);

    glass.add(this.add.sprite(0, 0, "hourglass"));
    glass.setScale(0.5);
    this.matter.add.gameObject(glass, {
      shape: shapes.hourglass,
      isStatic: true,
    });
    glass.setBounce(0.7);

    // for (let i = 0; i < 5; i++)
    // {
    //         // for the prototype, lets consider just picing a random color/sprite from a list?

    //         // this.genDownwardsSand('sand');
    //         this.genUpwardsSand('sand');
    // }

    // I had to close the top
    this.topBarrierTEMP = this.matter.add.rectangle(400, 240, 300, 20, {
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
            y: -0.0005,
          });
        }
      });
    }
  }

  genDownwardsSand(spriteImg) {
    let x = Phaser.Math.Between(280, 520);
    let y = 250;
    let sand = this.matter.add.sprite(x, y, spriteImg);

    // Set physical properties
    sand.setCircle();
    sand.setFriction(0.1);
    sand.setBounce(0.2);
    sand.setIgnoreGravity(false);

    // this is for collision detection
    sand.isDownSand = true;

    // Create a bottom sensor (only once, avoids duplicates)
    if (!this.bottomSensor) {
      this.bottomSensor = this.matter.add.rectangle(400, 690, 300, 20, {
        isStatic: true,
        isSensor: true,
      });
    }
  }

  genUpwardsSand(spriteImg) {
    let x = Phaser.Math.Between(280, 520);
    let y = 690;
    let sand = this.matter.add.sprite(x, y, spriteImg);

    // Set physical properties
    sand.setCircle();
    sand.setFriction(0.1);
    sand.setBounce(0.2);
    sand.setIgnoreGravity(true);

    // collision detection
    sand.isUpSand = true;

    // stupid upward sand needs to be stored in an array so its force can be updated in update()
    if (!this.upwardsSand) {
      this.upwardsSand = [];
    }
    this.upwardsSand.push(sand);

    // Create a top sensor (only once, avoids duplicates)
    if (!this.topSensor) {
      this.topSensor = this.matter.add.rectangle(400, 250, 300, 20, {
        isStatic: true,
        isSensor: true,
      });
    }
  }

  // fun random color selector
  getRandomSandColor() {
    const colors = ["redSand", "yellowSand", "blueSand"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
