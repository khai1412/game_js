
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
				gravity: {},
				debug: false
			}
		}
	});
	// add scene
	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	// để true để set scene chính
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		// load ảnh và tài nguyên vào chương trình
		this.load.image('sky', 'assets/sky.png');
		this.load.image('ground', 'assets/platform.png');
		this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.image('star', 'assets/star.png');
		this.load.image('bomb', 'assets/bomb.png');
	}
	create() {
		//this.scene.start('Preload');
		// tạo hình nền
		this.check = 11;
		this.add.image(400, 300, 'sky');
		this.gameOver_text;
		// tạo biến platform
		this.platforms = this.physics.add.staticGroup();
		// từ platform tại ra các thanh xanh xanh
		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
		this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 250, 'ground');
		this.platforms.create(750, 220, 'ground');
		// tao star
		this.stars = this.physics.add.group();
		this.bombs = this.physics.add.group();
		var star_x = 10;
		var star_y = 0;
		this.check_over = false;
		this.count_bomb = 1;
		for (var i = 0; i < 11; i++) {
			var star = this.stars.create(star_x, star_y, 'star');
			star_x += 70;
			star.setCollideWorldBounds(true);
			star.setGravityY(300);
			star.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
		}
		this.physics.add.collider(this.stars, this.platforms);

		// tạo biến player 
		this.player = this.physics.add.sprite(100, 300, 'player');
		// set trọng lượng theo trục Y
		this.player.setGravityY(300);
		// set cho nhân vật ko đi ra khỏi màn hình
		this.player.setCollideWorldBounds(true);
		// set độ nảy
		this.player.setBounce(0.2);
		// set va chạm với biến platform
		this.physics.add.collider(this.player, this.platforms);
		// Tạo animation
		this.anims.create({
			// từ khóa key....
			key: 'left',
			// chạy các khung frame từ 0 đến 3
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
			// tốc độ chạy của frame, tính theo khung hình
			frameRate: 10,
			// để cố định giá trị -1
			repeat: -1
		})
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
		})
		this.anims.create({
			key: 'turn',
			frames: [{ key: 'player', frame: 4 }],
			frameRate: 10
		})
		this.physics.add.overlap(this.player, this.stars, this.check_collision_star, null, this);
		this.physics.add.collider(this.bombs, this.platforms);
		this.physics.add.collider(this.player,this.bombs,this.gameOver,null,this);
		this.score = 0;
		// set score text gồm vị trí x,y,text,thuộc tính
		this.score_text = this.add.text(16, 16, 'score: ' + this.score, { fontSize: '32px', color: '#00FF00' });

	}
	update() {
		if(this.check_over==true){
			return; 
		}
		// tạo biến keyboard
		var keyboard = this.input.keyboard.createCursorKeys();
		if (keyboard.left.isDown) {
			// chạy anims
			this.player.anims.play('left', true);
			// set vận tốc của nhân vật
			this.player.setVelocityX(-160);

		} else if (keyboard.right.isDown) {
			this.player.anims.play('right', true);
			this.player.setVelocityX(160);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play('turn');
		}
		if (keyboard.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}
		// nếu số sao còn hoạt động trên màn = 0 thì
		if (this.stars.countActive(true) == 0) {
			// tạo vòng lặp đối với các phần tử con trong stars
			this.stars.children.iterate(function (child) {
				// kích hoạt lại body (trái với díable body)
				child.enableBody(true, child.x, 0, true, true);
			});
			// vòng lặp tạo boms
			for (var i = 0; i < this.count_bomb; i++) {
				var bom_x = Phaser.Math.Between(20, 770);
				var bom_y = Phaser.Math.Between(10, 30);
				var bom = this.bombs.create(bom_x, bom_y, 'bomb');
				bom.setCollideWorldBounds(true);
				bom.setBounce(1);
				bom.setGravityY(400);
				bom.setVelocityX(100);
			}
			// cộng biến đếm bom lên 1 dv
			this.count_bomb++;

		}
	}
	// sự kiện va chạm giữa 2 vật thể
	check_collision_star(a, b) {
		b.disableBody(true, true);
		this.check -= 1;
		this.score += 10;
		this.score_text.setText('score: ' + this.score);
	}
	//sự kiện gameOver
	gameOver(player,bom){
		// dừng hết sự kiện phsics
		this.physics.pause();
		// tạo chữ gameover
		this.gameOver_text= this.add.text(200,300,"GAME OVER",{fontSize:64,color:"#FF0000"});
		player.setTint(0xff0000);
		//player.disableBody(true,false);
		player.anims.play('turn');
		this.check_over=true;
		
	}

}