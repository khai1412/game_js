
window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 800,
		height: 600,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
            default: 'arcade',
            arcade: {
                gravity: { },
                debug: false
            }
        }
	});
	// add scene
	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	// để true để set scene chính
	game.scene.add("Boot", Boot,true);
});

class Boot extends Phaser.Scene {

	preload() {
		// load ảnh và tài nguyên vào chương trình
		this.load.image('sky','assets/sky.png');
		this.load.image('ground','assets/platform.png');
		this.load.spritesheet('player','assets/dude.png',{frameWidth:32, frameHeight:48});
	}
	create(){
		//this.scene.start('Preload');
		// tạo hình nền
		this.add.image(400,300,'sky');
		// tạo biến platform
		this.platforms = this.physics.add.staticGroup();
		// từ platform tại ra các thanh xanh xanh
		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
		// tạo biến player 
		this.player = this.physics.add.sprite(100,300,'player');
		// set trọng lượng theo trục Y
		this.player.setGravityY(300);
		// set cho nhân vật ko đi ra khỏi màn hình
		this.player.setCollideWorldBounds(true);
		// set độ nảy
		this.player.setBounce(0.2);
		// set va chạm với biến platform
		this.physics.add.collider(this.player,this.platforms);
		// Tạo animation
		this.anims.create({
			// từ khóa key....
			key:'left',
			// chạy các khung frame từ 0 đến 3
			frames:this.anims.generateFrameNumbers('player',{start:0,end:3}),
			// tốc độ chạy của frame, tính theo khung hình
			frameRate:10,
			// để cố định giá trị -1
			repeat:-1
		})
		this.anims.create({
			key:'right',
			frames:this.anims.generateFrameNumbers('player',{start:5,end:8}),
			frameRate:10,
			repeat:-1
		})
		this.anims.create({
			key:'turn',
			frames:[ { key: 'player', frame: 4 } ],
			frameRate:10	
		})
		
	}
	update(){
		// tạo biến keyboard
		var keyboard = this.input.keyboard.createCursorKeys();
		if(keyboard.left.isDown){
			// chạy anims
			this.player.anims.play('left',true);
			// set vận tốc của nhân vật
			this.player.setVelocityX(-160);
			
		} else if(keyboard.right.isDown){
			this.player.anims.play('right',true);
			this.player.setVelocityX(160);
		} else if(keyboard.up.isDown){
			this.player.setVelocityY(-300);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play('turn');
		}
		if (keyboard.up.isDown && this.player.body.touching.isDown)
        {
           this.player.setVelocityY(-330);
        }

	}
}