class Gallery extends Phaser.Scene {
    constructor() {
        super("GalleryScene");
        this.my = {sprite: {}};
    }
    preload(){
                //  Load body shape from JSON file generated using the editor
        this.load.json('hitbox', 'Scenes/Hitbox.json');
        this.load.image("hourglass", 'Scenes/hourglass.png');
        this.load.image("sand", 'Scenes/sand.png');
  
    }
    create(){
        this.matter.world.setBounds(0, 0, 900, 700);
        var shapes = this.cache.json.get('hitbox');
        let my = this.my;//Optionally for organizing sprites
        
        //this.matter.add.image(100, 100, 'glass', null, { shape: shape });
        const glass = this.add.container(400, 450);

        glass.add(this.add.sprite(0, 0, 'hourglass'));
        glass.setScale(0.5);
        this.matter.add.gameObject(glass, { shape: shapes.hourglass, isStatic: true });
        glass.setBounce(0.7);

        for (let i = 0; i < 32; i++)
            {
    
                my.g = this.matter.add.sprite(400, 0, 'sand').setAngle(20);
                //my.g.setScale(3);

            }
    }
    update(){
    }
    
}