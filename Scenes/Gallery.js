class Gallery extends Phaser.Scene {
    constructor() {
        super("GalleryScene");
        this.my = {sprite: {}};
    }

    preload(){
        //  Load body shape from JSON file generated using the editor
        this.load.json('hitbox', 'Scenes/hitbox.json');
        this.load.image("hourglass", 'Scenes/hourglass.png');
        this.load.image("sand", 'Scenes/sand.png');
        this.load.image("redSand", 'Scenes/sandR.png');
        this.load.image("yellowSand", 'Scenes/sandY.png');
        this.load.image("blueSand", 'Scenes/sandB.png');
  
    }

    create(){
        this.matter.world.setBounds(0, 0, 900, 700);
        let my = this.my;   //Optionally for organizing sprites
        let shapes = this.cache.json.get('hitbox');
        
        //this.matter.add.image(100, 100, 'glass', null, { shape: shape });
        const glass = this.add.container(400, 450);

        glass.add(this.add.sprite(0, 0, 'hourglass'));
        glass.setScale(0.5);
        this.matter.add.gameObject(glass, { shape: shapes.hourglass, isStatic: true });
        glass.setBounce(0.7);

        for (let i = 0; i < 32; i++)
        {
                // for the prototype, lets consider just picing a random color/sprite from a list?
                
                // this.genDownwardsSand('sand');
                this.genUpwardsSand('sand');
        }
    }

    update(){

    }

    genDownwardsSand(spriteImg){
        this.my.g = this.matter.add.sprite(400, 0, spriteImg).setAngle(20);
        this.my.g.setCircle();
        // this.my.g.setScale();
    }

    genUpwardsSand(spriteImg){
        let g = this.matter.add.sprite(400, 600, spriteImg);
        g.setCircle();
        let p = this.matter.bodies.circle(400, 600, 5, {
            render: {
                sprite: g,
            },
            force: {x: 0, y: -500},
        });
        // console.log(typeof(p));
        this.matter.body.setMass(p, -50); // idk why this and other functions dont appear to do anything????
        // this.my.g.setScale();
    }
    
}