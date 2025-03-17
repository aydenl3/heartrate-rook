class littleRook extends Phaser.Scene {
    constructor() {
        super("littleRook");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 8;
        this.bulletSpeed = 20;
        this.pawnSpeed = 2;

        this.bulletCooldown = 45;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
        this.hpCooldown = 40;
        this.hpCooldownCounter = 0;

        this.wave = 10;
        this.empty = true;
        this.waveCount = 100;
        this.hp = 3;
        this.score = 0;
        this.enemyArray = [];
        this.gameOn = true;
        this.jitter = 1;
        this.jitterCooldownCounter = 0;
        this.jitterCooldown = 10;
        this.heartrate = 60;

    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("rook", "structure_tower.png");
        this.load.image("d2", "d2.png");
        this.load.image("d4", "d4_outline.png");
        this.load.image("chess_pawn", "chess_pawn.png");
        this.load.image("suit_hearts", "suit_hearts.png");
        this.load.image("chess_knight", "chess_knight.png");
        this.load.image("chess_bishop", "chess_bishop.png");
        this.load.image("chess_queen", "chess_queen.png");
        this.load.image("chess_rook", "chess_rook.png");
        this.load.image("arrow1", "arrow_clockwise2.png");
        this.load.image("arrow2", "arrow_rotate2.png");
        this.load.image("arrow3", "arrow_clockwise.png");
        this.load.image("arrow4", "arrow_rotate.png");
        this.load.image("dice_6", "dice_6.png");
        this.load.audio("impact", "cardPlace1.ogg");
        this.load.audio("shoot", "diceThrow1.ogg");
        this.load.audio("ouch", "cardOpenPackage2.ogg");
        this.load.audio("endsound", "cardFan1.ogg");
        this.load.audio("altshoot", "chipsHandle4.ogg");

        
        //this.load.image("board","blank-chess-board.png");
    }

    create() {
        
        let my = this.my;
        //this.add.sprite(400, 300, 'board');

        this.anims.create({
            key: "puff",
            frames: [
                { key: "arrow1" },
                { key: "arrow2" },
                { key: "arrow3" },
                { key: "arrow4" },
            ],
            framerate: 1,
            duration:250,
            repeat: 2,
            hideOnComplete: true
        });


        this.text1 = this.add.text(10, 10, 'Phaser Text with Tint', { font: '20px Times, serif' });
        this.scoretext = this.add.text(0, 520, this.score, { font: '20px Times, serif' });
        this.scoretext.visible = false;
        this.title = this.add.text(200, 200, 'Little Rook\'s Revenge', { font: 'bold 40px Times' });
        this.playText = this.add.text(220, 400, 'Play', { font: 'bold 20px Times' });
        this.creditsText = this.add.text(510, 400, 'Credits', { font: 'bold 20px Times' });
        this.actualCredits = this.add.text(200, 200, 'Little Rook\'s Revenge\n\n Game by Ayden Le\nAssignment designed by Jim Whitehead\nAssets from Kenny.nl\nSpecial thanks to Alina\n \n\n\n\n\n\n\n\n\n\nAnd Toby I guess...', { font: '22px Times' });
        this.actualCredits.visible = false;
        
        my.sprite.heart3 = this.add.sprite(70,game.config.height - 90,"suit_hearts");
        my.sprite.heart3.setScale(0.5);
        my.sprite.heart3.visible = false;
        my.sprite.heart2 = this.add.sprite(40,game.config.height - 90,"suit_hearts");
        my.sprite.heart2.setScale(0.5);
        my.sprite.heart2.visible = false;
        my.sprite.heart1 = this.add.sprite(10,game.config.height - 90,"suit_hearts");
        my.sprite.heart1.setScale(0.5);
        my.sprite.heart1.visible = false;

        my.sprite.startButton = this.add.sprite(240,350,"chess_rook");
        my.sprite.startButton.setScale(1);
        my.sprite.creditsButton = this.add.sprite(540,350,"chess_pawn");
        my.sprite.creditsButton.setScale(0.7);
//-------------------------------------------------------------------------------------------
//WAVE KNIGHT

        this.knightWavePath = new Phaser.Curves.Spline([
            game.config.width/7, 50,
            game.config.width/7, 300,
            game.config.width/7*2, 300,
            game.config.width/7*2, 550,
            game.config.width/7*3, 550,
            game.config.width/7*3, 300,
            game.config.width/7*4, 300,
            game.config.width/7*4, 550,
            game.config.width/7*5, 550,
            game.config.width/7*5, 300,
            game.config.width/7*6, 300,
            game.config.width/7*6, 50,

        ]);
        my.sprite.knight1 = this.add.follower(this.knightWavePath, 10, 10, "chess_knight");
         this.waveKnight = {
            sprite: my.sprite.knight1,
            name: "Wave Knight",
            scale: 0.9,
            maxhp: 3,
            hp: 0,
            path: this.knightWavePath,
            atkCooldown: 60,
            atkCooldownCounter: 0,
          };
       
        this.waveKnight.sprite.visible = false;
        this.waveKnight.sprite.active = false;
        this.waveKnight.sprite.setScale(this.waveKnight.scale);
        this.enemyArray.push(this.waveKnight);
//-------------------------------------------------------------------------------------------
//OCTO KNIGHT

this.knightOctoPath = new Phaser.Curves.Spline([
    game.config.width/6*3,300,
    game.config.width/6*3, 50,
    game.config.width/6*3, 300,
    game.config.width/6*6, 50,
    game.config.width/6*3, 300,
    game.config.width/6*6, 300,
    game.config.width/6*3, 300,
    game.config.width/6*6, 550,
    game.config.width/6*3, 300,
    game.config.width/6*0, 550,
    game.config.width/6*3, 300,
    game.config.width/6*0, 300,
    game.config.width/6*3, 300,
    game.config.width/6*0, 50,
    game.config.width/6*3, 300,

]);
my.sprite.knight2 = this.add.follower(this.knightOctoPath, 10, 10, "chess_queen");
 this.octoKnight = {
    sprite: my.sprite.knight2,
    name: "Octo Knight",
    scale: 0.9,
    maxhp: 9,
    hp: 0,
    path: this.knightOctoPath,
    atkCooldown: 100,
    atkCooldownCounter: 0,
  };

this.octoKnight.sprite.visible = false;
this.octoKnight.sprite.active = false;
this.octoKnight.sprite.setScale(this.octoKnight.scale);
this.enemyArray.push(this.octoKnight);

//-------------------------------------------------------------------------------------------
//DIAMOND BISHOP

        this.bishopDiamondPath = new Phaser.Curves.Spline([
            game.config.width/4*3, 50,
            game.config.width/4*0, 300,
            game.config.width/4*2, 550,
            game.config.width/4*4, 300,
            game.config.width/7*1, 50,

        ]);
        my.sprite.bishop1 = this.add.follower(this.bishopDiamondPath, 10, 10, "chess_bishop");
         this.diamondBishop = {
            sprite: my.sprite.bishop1,
            name: "Diamond Bishop",
            scale: 0.9,
            maxhp: 3,
            hp: 0,
            path: this.bishopDiamondPath,
            atkCooldown: 30,
            atkCooldownCounter: 0,
          };
       
        this.diamondBishop.sprite.visible = false;
        this.diamondBishop.sprite.active = false;
        this.diamondBishop.sprite.setScale(this.diamondBishop.scale);
        this.enemyArray.push(this.diamondBishop);
        //console.log(this.enemyArray[0]);
        //console.log(this.enemyArray[1]);
        //console.log(this.enemyArray[2]);
//----------------------------------------------------------------------------------------------
//KINGSIDE CASTLE
        my.sprite.kingsideCastle = this.add.sprite(400,50,"chess_knight");
        this.Castle = {
            sprite: my.sprite.kingsideCastle,
            name: "Kingside Castle",
            scale: 1,
            maxhp: 10,
            hp: 0,
            atkCooldown: 30,
            atkCooldownCounter: 0,
            speed: 10,
            behav:1,
            behavCooldownCounter:0,
            behavCooldown:100,
          };
       
        my.sprite.kingsideCastle.visible = false;
        my.sprite.kingsideCastle.active = false;
        my.sprite.kingsideCastle.setScale(this.Castle.scale);
//-------------------------------------------------------------------------------------------------
//////
        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        my.sprite.rook = new Player(this, game.config.width/2, game.config.height - 40, "rook", null,
                                        this.left, this.right, 5);
        my.sprite.rook.setScale();



//---------------------------------------------------------------------------------------
//PLAYER BULLETS
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "d2",
            maxSize: 3,
            runChildUpdate: true,
            }
        )

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            visible:false,
            key: my.sprite.bulletGroup.defaultKey,
            setScale: { x: 0.4, y: 0.4},
            repeat: my.sprite.bulletGroup.maxSize-1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);


//-----------------------------------------------------------------------------------------
//ENEMY BULLETS
        my.sprite.badBulletGroup = this.add.group({
            active: true,
            defaultKey: "d4",
            maxSize: 20,
            runChildUpdate: true,
            }
        )

        my.sprite.badBulletGroup.createMultiple({
            classType: BadBullet,
            active: false,
            visible: false,
            key: my.sprite.badBulletGroup.defaultKey,
            setScale: { x: 0.4, y: 0.4},
            repeat: my.sprite.badBulletGroup.maxSize-1
        });
        my.sprite.badBulletGroup.propertyValueSet("speed", 10);
//-----------------------------------------------------------------------------------------
//PAWNS
        my.sprite.pawnGroup = this.add.group({
            active: true,
            defaultKey: "chess_pawn",
            maxSize: 20,
            runChildUpdate: true,
            }
        )
        my.sprite.pawnGroup.createMultiple({
            classType: Pawn,
            active: false,
            visible:false,
            key: my.sprite.pawnGroup.defaultKey,
            setScale: { x: 0.7, y: 0.7},
            repeat: my.sprite.pawnGroup.maxSize-1
        });
        my.sprite.pawnGroup.propertyValueSet("speed", this.pawnSpeed);
        my.sprite.pawnGroup.propertyValueSet("pew", false);

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Little Rook\'s Revenge'
        //console.log(my.sprite.bulletGroup);
        //console.log(my.sprite.bulletGroup.children);
        //console.log(my.sprite.bulletGroup.children.entries);
    }

    update() {

        let my = this.my;
        this.checkJitter();
        this.decrementCounters();
        this.enemyShoot();        
        if(this.empty == true){
            if(this.wave == 0){
                this.wave0();
                //console.log(my.sprite.pawnGroup);
                //console.log(my.sprite.bulletGroup);
            } 
            if(this.wave == 1){
                this.wave1();
                //console.log(my.sprite.pawnGroup);
                //console.log(my.sprite.bulletGroup);
            } 
            if(this.wave == 2){
                this.wave2();
            }
            if(this.wave == 3){
                this.wave3();
            }
            if(this.wave == 4){
                this.wave4();
            }
            if(this.wave == 5){
                this.wave5();
            }
            if(this.wave == 10){
                this.wave10();
            }
        }


        // Check for bullet being fired
        if (this.space.isDown) {
            if(this.gameOn == true){
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                this.sound.play("altshoot");
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.x = my.sprite.rook.x;
                    bullet.y = my.sprite.rook.y - (my.sprite.rook.displayHeight/2);
                }
            }
            }
        }

        // update the player avatar by by calling the elephant's update()
        my.sprite.rook.update();
        for (let bullet of my.sprite.bulletGroup.children.entries) {
            if(bullet.active){
           for(let pawn of my.sprite.pawnGroup.children.entries){
                if(pawn.active){
                if (this.collides(pawn, bullet)) {
                    // start animation
                    this.puff = this.add.sprite(pawn.x, pawn.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    this.sound.play("impact");
                    pawn.visible = false;
                    this.addToScore(1);
                    pawn.y = 1000;
                    this.bulletCooldownCounter = this.bulletCooldown/3;
                }
                }
           }
           for(let enemy of this.enemyArray){
                if(enemy.sprite.active){
                if(this.collides(enemy.sprite, bullet)){
                    
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    this.sound.play("impact");
                    

                    enemy.hp--;
                    if(enemy.hp == 0){
                        this.puff = this.add.sprite(enemy.sprite.x, enemy.sprite.y, "whitePuff03").setScale(0.25).play("puff");
                        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        }, this);
                        this.bulletCooldownCounter = this.bulletCooldown/3;
                        enemy.sprite.visible = false;
                        enemy.sprite.active = false;
                        enemy.sprite.stopFollow();
                        enemy.sprite.y = -100;
                        enemy.sprite.x = -100;
                        //console.log(enemy.sprite);
                        this.addToScore(enemy.maxhp);
                    }
                }
                }
            }
            if(my.sprite.startButton.visible == true){
                if(this.collides(my.sprite.startButton, bullet)){
                    my.sprite.startButton.visible = false;
                    my.sprite.creditsButton.visible = false;
                    bullet.y = -100;
                    this.sound.play("impact");
                    this.reset();
                }
                if(this.collides(my.sprite.creditsButton, bullet)){
                    my.sprite.creditsButton.visible = false;
                    my.sprite.startButton.visible = false;
                    bullet.y = -100;
                    this.sound.play("impact");
                    this.Credits();
                }
            }
            if(this.Castle.sprite.active == true){
                if(this.collides(this.Castle.sprite, bullet)){
                    this.Castle.hp--;
                    //console.log(this.Castle.hp);
                    bullet.y = -100;
                    this.sound.play("impact");
                    if(this.Castle.hp == 6 || this.Castle.hp == 4){
                        //console.log("hi");
                        this.waveKnight.sprite.x = this.knightWavePath.points[0].x;
                        this.waveKnight.sprite.y = this.knightWavePath.points[0].y;
                        this.waveKnight.sprite.visible = true;
                        this.waveKnight.sprite.active = true;
                        this.waveKnight.hp = this.waveKnight.maxhp;
                        this.waveKnight.atkCooldownCounter = this.waveKnight.atkCooldown;
                        this.waveKnight.sprite.startFollow({
                           from: 0,
                           to: 1,
                           delay: 0,
                           duration: 8000,
                           ease: 'Sine.easeInOut',
                           repeat: -1,
                           yoyo: true,
                           rotateToPath: false,
                           rotationOffset: -90
                          })
                        this.waveKnight.hp = 1;

                    }
                    if(this.Castle.hp <= 0){
                        this.Victory();
                    }
                }
            }
            }
        }
        for(let pawn of my.sprite.pawnGroup.children.entries){
            if(pawn.active){
                if(this.collides(pawn,my.sprite.rook)){
                    this.loseHP();
                    //console.log("Ouchie Pawn");
                }
                }
        }
        for(let enemy of this.enemyArray){
            if(enemy.sprite.active){
                if(this.collides(enemy.sprite,my.sprite.rook)){
                    this.loseHP();
                    //console.log("Ouchie " + enemy.name);
                }
            }
        }
        if(this.collides(this.Castle.sprite,my.sprite.rook)){
            this.loseHP();
        }
        for(let Bbullet of my.sprite.badBulletGroup.children.entries){
            if(Bbullet.active == true){
                if(Bbullet.y > 500){
                    if(this.collides(Bbullet,my.sprite.rook)){
                        Bbullet.y = -100;
                        this.loseHP();
                        //console.log("Ouchie Bullet");
                        
                    }
                }
            }
            
        }
        this.checkScore();
        if (Phaser.Input.Keyboard.JustDown(this.R)) {
            if(this.gameOn == false){
               console.log("RESET");
               this.reset();
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.ESCKey)) {
            if(this.gameOn == false){
               console.log("TITLE");
               this.Title();
            }
        }

    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    checkJitter(){
        if (Phaser.Input.Keyboard.JustDown(this.left) || Phaser.Input.Keyboard.JustDown(this.right) || Phaser.Input.Keyboard.JustDown(this.space)){
            this.heartrate += 5
        }
        else if (this.heartrate > 60){
            this.heartrate -= 0.2
        }

        if(this.jitterCooldownCounter <= 0 ){
            this.jitterCooldownCounter = this.jitterCooldown;
            
            if (this.heartrate <= 80){  
                this.my.sprite.kingsideCastle.setTexture("chess_knight");
                this.jitter = 1;
                this.pawnSpeed = 3
            }
            else if(this.heartrate <= 100){
                this.my.sprite.kingsideCastle.setTexture("chess_bishop");
                this.jitter = 2;
                this.pawnSpeed = 5
            }
            else if (this.heartrate <= 140){
                this.my.sprite.kingsideCastle.setTexture("chess_rook");
                this.jitter = 3;
                this.pawnSpeed = 8
            }
            else if (this.heartrate <= 180){
                this.my.sprite.kingsideCastle.setTexture("chess_queen");
                this.jitter = 4;
                this.pawnSpeed = 10;
            }
        }

        if(this.wave == 5){
            this.bossAttack0();
            if(this.Castle.behavCooldownCounter <= 0){
            
                this.Castle.behavCooldownCounter = this.Castle.behavCooldown;
                this.Castle.behav = Math.floor(Math.random() * 4);
                //this.pawnSpeed = Math.floor(Math.random() * 3) + 2;
    
            }
            if(this.Castle.behav == 1){
                if (this.jitter == 1){
                    this.bossAttackBurst();
                }
                else if (this.jitter == 2){
                    this.bossAttackBurst();   
                }
                else if (this.jitter == 3){
                    this.bossAttackBurst();
                }
                else if (this.jitter == 4){
                    this.bossAttackCharge();
                }

            }
            if(this.Castle.behav == 0){
                if (this.jitter == 1){
                    this.bossAttackStalk();
                }
                else if (this.jitter == 2){
                    this.bossAttackStalk();   
                }
                else if (this.jitter == 3){
                    this.bossAttackBurst();
                }
                else if (this.jitter == 4){
                    this.bossAttackCharge();
                }
            }
            if(this.Castle.behav == 2){
                if (this.jitter == 1){
                    this.bossAttackStalk();
                }
                else if (this.jitter == 2){
                    this.bossAttackBurst();   
                }
                else if (this.jitter == 3){
                    this.bossAttackBurst();
                }
                else if (this.jitter == 4){
                    this.bossAttackCharge();
                }
            }
            if(this.Castle.behav == 3){
                if (this.jitter == 1){
                    this.bossAttackStalk();
                }
                else if (this.jitter == 2){
                    this.bossAttackStalk();   
                }
                else if (this.jitter == 3){
                    this.bossAttackCharge();
                }
                else if (this.jitter == 4){
                    this.bossAttackCharge();
                }
            }
            if(this.Castle.behav == 4){
                this.bossAttackRetreat();
            }
        }
        

    }

    loseHP(){
        if(this.hpCooldownCounter <= 0){
            this.sound.play("ouch");
            if(this.hp == 3){
                this.my.sprite.heart3.visible = false;
                this.hp = 2;
                this.hpCooldownCounter = this.hpCooldown;
            }
            else if(this.hp == 2){
                this.my.sprite.heart2.visible = false;
                this.hp = 1;
                this.hpCooldownCounter = this.hpCooldown;
            }
            else if(this.hp == 1){
                this.my.sprite.heart1.visible = false;
                this.hp = 0;
                this.hpCooldownCounter = this.hpCooldown;
                this.gameover();
            }
        }

    }
    addToScore(points){
        this.score += points;
        this.scoretext.setText("+" + this.score);
    }
    decrementCounters(){
        this.bulletCooldownCounter--;
        this.waveCount--;
        this.hpCooldownCounter--;
        this.jitterCooldownCounter--;
        for(let enemy of this.enemyArray){
            enemy.atkCooldownCounter--;
        }
        this.Castle.atkCooldownCounter--;
        this.Castle.behavCooldownCounter--;
    }

    enemyShoot(){
        let my = this.my
        if(this.gameOn == true){
        for(let enemy of this.enemyArray){
            //console.log(enemy);
            if(enemy.sprite.active == true){
                //console.log(enemy.sprite.active);
            if(enemy.atkCooldownCounter <= 0){
                //console.log("PEWW");
                let bullet = my.sprite.badBulletGroup.getFirstDead();
                if(bullet != null){
                    //console.log(bullet);
                    bullet.makeActive();
                    bullet.x = enemy.sprite.x;
                    //console.log(enemy.sprite.x);
                    //console.log(bullet.x);
                    bullet.y = enemy.sprite.y;
                    enemy.atkCooldownCounter = enemy.atkCooldown;  
                }
            }
            }
        }
        }
    }

    gameover(){
        this.sound.play("endsound");
        this.gameOn = false;
        this.wave = 11;
        for(let pawn of this.my.sprite.pawnGroup.children.entries){
            //console.log(pawn);
            pawn.visible = false;
            pawn.y = 1000;
        }
        for(let bullet of this.my.sprite.bulletGroup.children.entries){
            bullet.visible = false;
            bullet.y = -800;
        }
        for (let enemy of this.enemyArray){
            //console.log(enemy);
            enemy.sprite.visible = false;
            enemy.sprite.active = false;
            enemy.sprite.stopFollow();
            enemy.sprite.y = -100;
        }
        this.Castle.sprite.visible = false;
        this.Castle.sprite.active = false;
        this.my.sprite.rook.visible = false;
        this.my.sprite.rook.active = false;
        this.text1.setText("GAME OVER.\nPress R to Play Again\nPress ESC to Return to Title");
        this.scoretext.setText("Your Final Score: " + this.score);
        
    }
    reset(){

        this.playerSpeed = 5;
        this.bulletSpeed = 20;
        this.pawnSpeed = 3;

        this.bulletCooldown = 45;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 45;
        this.hpCooldown = 40;
        this.hpCooldownCounter = 0;

        this.wave = 5;
        this.empty = true;
        this.waveCount = 100;
        this.hp = 3;
        this.score = 0;
        this.title.visible = false;
        this.playText.visible = false;
        this.creditsText.visible = false;
        this.gameOn = true;
        this.my.sprite.rook.visible = true;
        this.my.sprite.rook.active = true;
        this.my.sprite.heart1.visible = true;
        this.my.sprite.heart2.visible = true;
        this.my.sprite.heart3.visible = true;
        this.scoretext.visible = true;
        this.scoretext.setText(this.score);

    }
    Title(){
       this.wave = 10;
       this.empty = true;
       this.waveCount = 100;
       this.hp = 3;
       this.gameOn = true;
       this.my.sprite.rook.visible = true;
       this.title.visible = true;
       this.title.setText("Little Rook\'s Revenge");
       this.playText.visible = true;
       this.creditsText.visible = true;
       this.my.sprite.startButton.visible = true;
       this.my.sprite.creditsButton.visible = true;
       this.actualCredits.visible = false;
    }
    Credits(){
        this.wave = 11;
        this.empty = true;
        this.waveCount = 100;
        this.hp = 3;
        this.gameOn = false;
        this.my.sprite.rook.visible = false;
        this.title.visible = false;
        this.playText.visible = false;
        this.creditsText.visible = false;
        this.text1.setText("Press ESC to Return to Title");
        this.actualCredits.visible = true;
        this.my.sprite.startButton.visible = false;
        this.my.sprite.creditsButton.visible = false;
     }
     Victory(){
        this.gameOn = false;
        this.wave = 11;
        for(let pawn of this.my.sprite.pawnGroup.children.entries){
            //console.log(pawn);
            pawn.visible = false;
            pawn.y = 1000;
        }
        for(let bullet of this.my.sprite.bulletGroup.children.entries){
            bullet.visible = false;
            bullet.y = -800;
        }
        for (let enemy of this.enemyArray){
            //console.log(enemy);
            enemy.sprite.visible = false;
            enemy.sprite.active = false;
            enemy.sprite.stopFollow();
            enemy.sprite.y = -100;
        }
        this.Castle.sprite.visible = false;
        this.Castle.sprite.active = false;
        this.my.sprite.rook.visible = false;
        this.my.sprite.rook.active = false;
        this.text1.setText("VICTORY\nPress R to Play Again\nPress ESC to Return to Title\n THANKS FOR PLAYING!!");
        this.scoretext.setText("Your Final Score: " + this.score);
       
     }
    checkScore(){
        if (this.wave == 0){
            if(this.score >= 7){
                this.wave++;
                this.empty = true;
            }
        }
        if(this.wave == 1){
            if(this.score >= 14){
                this.wave++;
                this.empty = true;
            }
        }
        if(this.wave == 2){
            if(this.score >= 21){
                this.wave++;
                this.empty = true;
            }
        }
        if(this.wave == 3){
            if(this.score >= 36){
                this.wave++;
                this.empty = true;
            }
        }
        if(this.wave == 4){
            if(this.score >= 53){
                this.wave++;
                this.empty = true;
            }
        }
    }
    wave10(){
        let my = this.my;
        this.text1.setText("Press Space to Shoot \nPress A to Move Left \nPress D to Move Right");
        this.empty=false;
    }
    wave5(){
        let my = this.my;
        this.text1.setText("Wave V : \n Boss: King Side Castle");
        for(let i = 0; i <= 1; i++){
            let pawn = my.sprite.pawnGroup.getFirstDead();
            if(pawn != null){
                //console.log(pawn);
                pawn.makeActive();
                if (i == 0){
                    pawn.x = game.config.width/6 * 4;
                    pawn.y = 50;
                }
                if (i == 1){
                    pawn.x = game.config.width/6 * 2;
                    pawn.y = 50;
                }
                if (i == 2){
                    pawn.x = game.config.width/6 * 5;
                    pawn.y = 350;
                }
                if (i == 3){
                    pawn.x = game.config.width/6 * 4;
                    pawn.y = 400;
                }
                if (i == 4){
                    pawn.x = game.config.width/6 * 2;
                    pawn.y = 400;
                }
                if (i == 5){
                    pawn.x = game.config.width/6 * 1;
                    pawn.y = 350;
                }
                if (i == 6){
                    pawn.x = game.config.width/6 * 1;
                    pawn.y = 150;
                }
                if (i == 7){
                    pawn.x = game.config.width/6 * 2;
                    pawn.y = 50;
                }
                //console.log(i);
            }
            

        }
        my.sprite.kingsideCastle.x = 400;
        my.sprite.kingsideCastle.y = 50;
        my.sprite.kingsideCastle.visible = true;
        my.sprite.kingsideCastle.active = true;
        this.Castle.hp = this.Castle.maxhp;
        this.Castle.atkCooldownCounter = this.Castle.atkCooldown;
        this.empty=false;

    }
    bossAttack0(){
        let my = this.my;
        if(this.waveCount < 0){
            this.waveCount = 100;
            let pawn = my.sprite.pawnGroup.getFirstDead();
            this.randx = Math.floor(Math.random() * game.config.width-100);
            this.randy = Math.floor(Math.random() * 50);
            if(pawn != null){
                pawn.makeActive();
                    pawn.x = this.Castle.sprite.x;
                    pawn.y = 100;
            } 

        }

    }
    bossAttackStalk(){
        let my = this.my;
        if(this.Castle.sprite.x > my.sprite.rook.x){
            this.Castle.sprite.x -= this.Castle.speed-8;
        }
        if(this.Castle.sprite.x < my.sprite.rook.x){
            this.Castle.sprite.x += this.Castle.speed-8;
        }
    }
    bossAttackBurst(){
        let my = this.my;
        if(this.Castle.sprite.x > my.sprite.rook.x){
            this.Castle.sprite.x -= this.Castle.speed-6;
        }
        if(this.Castle.sprite.x < my.sprite.rook.x){
            this.Castle.sprite.x += this.Castle.speed-6;
        }
        let bullet = my.sprite.badBulletGroup.getFirstDead();
        for(let i = 0; i <= 1; i++){
        if(bullet != null){
            //console.log(bullet);
            bullet.makeActive();
            bullet.x = this.Castle.sprite.x;
            //console.log(enemy.sprite.x);
            //console.log(bullet.x);
            bullet.y = this.Castle.sprite.y;
        }
    }
    }
    bossAttackCharge(){
        let my = this.my;
        if(this.Castle.sprite.x > my.sprite.rook.x){
            this.Castle.sprite.x -= this.Castle.speed-8;
        }
        if(this.Castle.sprite.x < my.sprite.rook.x){
            this.Castle.sprite.x += this.Castle.speed-8;
        }
        if(this.Castle.sprite.y < 550){
            this.Castle.sprite.y += this.Castle.speed;
        }
        
        if(this.Castle.behavCooldownCounter < 30){
            this.Castle.behav = 4;
        }
        
    }
    bossAttackRetreat(){
        let my = this.my;
        //console.log("RUNNN");
        if(this.Castle.sprite.y > 50){
            this.Castle.sprite.y -= this.Castle.speed + 10 ;
        }

        
    }
    bossAttackSummon(){
        let my = this.my;
        if(this.Castle.sprite.x > my.sprite.rook.x){
            this.Castle.sprite.x -= this.Castle.speed-6;
        }
        if(this.Castle.sprite.x < my.sprite.rook.x){
            this.Castle.sprite.x += this.Castle.speed-6;
        }
        let bullet = my.sprite.badBulletGroup.getFirstAlive();
        if (bullet != null){
        let pawn = my.sprite.pawnGroup.getFirstDead();
        pawn.makeActive();
        pawn.x = bullet.x;
        pawn.y = bullet.y - 200;
        bullet.y = 800;
        }
    }
}
         