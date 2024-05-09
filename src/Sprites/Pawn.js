class Pawn extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.waiter = 45;
        this.waitTimer = 45;
        this.behav = 1;
        this.retreating = false;
        return this;

    }

    update() {
        if (this.active) {
            this.newBehav();
            if (this.y > (600 + this.displayHeight) || this.x < 0 || this.x > 800) {
                this.makeInactive();
            }
            else if(this.y < 550 && this.retreating == false){
                if(this.behav == 9){
                //console.log("pew!");
                   this.shuffleRight();
                }
                if(this.behav == 10){
                //console.log("pew!");
                   this.shuffleLeft();
                }
                else if (this.behav > 6){
                   this.walk();
                }
            }
            else{
                    if(this.y >= 450){
                        this.retreat();
                    }
                    else{
                        this.retreating = false;
                    }



            }
        }
        this.waiter--;
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }
    newBehav(){
        if(this.waiter <= 0){
            this.behav = Math.floor(Math.random() * 11);
            this.waiter = this.waitTimer;
        }
    }
    walk(){
        this.y += this.speed;
    }
    shuffleRight(){
        if(this.x < 780){
        this.x += this.speed/2;
        }
        this.y += this.speed/2;
    }
    shuffleLeft(){
        if(this.x > 20){
            this.x -= this.speed/2;
        }
        this.y += this.speed/2;
    }
    retreat(){
        this.retreating = true;
        this.y -= this.speed;
    }
}