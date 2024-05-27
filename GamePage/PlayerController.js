class PlayerController{
    constructor(){
        this.accelerationSpeed = .0015;
        this.breakSpeed = this.accelerationSpeed;
        this.frictionValue = .0001;
        this.dragCoefficient = .003;

        this.turnMultiplier = 8;
        this.wheelRotationSpeed = .2;
        this.turnVelocity = 0; //represents the direction the wheel is pointing ranges from -1 to 1
        this.transform
        this.xv = 0;
        this.yv = 0;
        this.velocity = 0;
        this.maxVelocity = 1;
        this.minVel = .01
        this.accelerateKey = "up";
        this.reverseKey = "down";
        this.breakKey = "space";

        this.mph = 0;

        this.colliding = false;
        this.crashed = false;

        this.finishedLevel = false;
        this.spawnedNextLevelBox = false;
    }
    Start(){
        this.transform = this.parentObject.GetComponent(Transform);
    }
    //in this one unit is equivalent to 2 meters
    Update(){
        //update car position relative to direction using this
        let forX = Math.cos(degToRad(this.transform.r));
        let forY = Math.sin(degToRad(this.transform.r));
        if(!this.finishedLevel){
            if(!Input.GetKey(this.breakKey)){
                if(Input.GetKey(this.accelerateKey) && !this.crashed){
                    //car is rotated so accerate will move object to the right
                    this.velocity += this.accelerationSpeed;
                    this.PlayMovingSound(true);
                }
                if(Input.GetKey(this.reverseKey) && !this.crashed){
                    this.velocity -= this.accelerationSpeed;
                    this.PlayMovingSound(false);
                }
            }
            else{
                //breaking.
                this.velocity = AddAwayFromZero(this.velocity, -this.breakSpeed);
                if(this.velocity != 0){
                    AudioManager.PlayAudioIfDone(tireSkidSound, 100, "skid", .2);
                }
            }
            //turning
            this.turnVelocity += Input.HorizontalArrows * this.wheelRotationSpeed;
            if(Input.HorizontalArrows == 0){
                this.turnVelocity = AddAwayFromZero(this.turnVelocity, -this.wheelRotationSpeed * Math.abs(this.velocity));
            }
            if(this.turnVelocity > 1) this.turnVelocity = 1;
            if(this.turnVelocity < -1) this.turnVelocity = -1;
            this.transform.r -= this.turnVelocity * this.turnMultiplier * this.velocity;
        }
        else if(!this.spawnedNextLevelBox){
            this.spawnedNextLevelBox = true;
            createObject(new Object("FinalSpeedText", [new TextDisplay("Congratulations! Your Final Speed Was", canvas.width / 2 - 400, 280,undefined,false,false,"#0052F5")]));
            createObject(new Object("FinalSpeedValue", [new TextDisplay(Math.abs(Math.round(this.mph)) + " MPH", canvas.width / 2 - 70, 340,undefined,false,false,"#0052F5")]));
            createObject(new Object("Next Level Button", [new TextDisplay("Next Level", canvas.width / 2 - 100, 400, 260, true, true, "black", "lime", "#2F2820", "#ACFFA9"), new Button("Next Level")]));
            createObject(new Object("RetryButton", [new TextDisplay("Try Again", canvas.width / 2 - 100, 470, 250, true, true, "black", "blue", "#2F2820", "#9797FF"), new Button("Retry")]));
        }

        //air resistance
        this.velocity = AddAwayFromZero(this.velocity, -this.dragCoefficient * (this.velocity**2));
        //friction
        this.velocity = AddAwayFromZero(this.velocity, -this.frictionValue);

        this.xv = forX * this.velocity;
        this.yv = forY * this.velocity;

        //update position
        this.transform.x += this.xv;
        this.transform.y += this.yv;

        let unitsPerSec = this.velocity * LoopsPerSec;
        let metersPerSec = unitsPerSec * 2;
        this.mph = metersPerSec * 2.237;

        //Check if colliders are colliding
        this.colliding = false;
        for(let i = 0; i < this.parentObject.components.length; i++){
            if(this.parentObject.components[i] instanceof CircleCollider){
                if(this.parentObject.components[i].colliding){
                    this.colliding = true;
                    break;
                }
            }
        }

        if(this.colliding){
           /* this.velocity = AddAwayFromZero(this.velocity, -this.breakSpeed * 5);
            this.velocity = AddAwayFromZero(this.velocity, -this.dragCoefficient * 5 * (this.velocity**2));
            this.colliding = false;*/
            if(!this.crashed){
                AudioManager.PlayAudio(crashSound, 2000, "crash", .07);
                if(!this.finishedLevel){
                    createObject(new Object("FinalSpeedText", [new TextDisplay("Final Speed", canvas.width / 2 - 110, 280)]));
                    createObject(new Object("FinalSpeedValue", [new TextDisplay(Math.abs(Math.round(this.mph)) + " MPH", canvas.width / 2 - 90, 340)]));
                    createObject(new Object("RetryButton", [new TextDisplay("Try Again", canvas.width / 2 - 100, 400, 250, true, true, "black", "red", "#2F2820", "#FF8585"), new Button("Retry")]));
                }
            }
            this.velocity = 0;
            this.crashed = true;
        }
    }
    SetMPH(MPH){
        this.velocity = MPH / 2.237 / 2 / LoopsPerSec;
        this.mph = MPH;
    }
    PlayMovingSound(increasing){
        if(increasing && this.velocity > 0 || !increasing && this.velocity < 0){
            if(!this.crashed)
            AudioManager.PlayAudioIfDone(carEngineSound, 450, "accelerate", .1);
        }
        else{
            AudioManager.PlayAudioIfDone(tireSkidSound, 100, "skid", .2);
        }
    }
}