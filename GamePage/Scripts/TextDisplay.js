class TextDisplay{
    constructor(text, posX, posY, width, hasBox, isClickable, textColor, boxColor, borderColor, selectionColor){
        this.text = text;
        this.transform;
        this.startX = posX;
        this.startY = posY;
        this.hasBox = hasBox;
        this.isClickable = isClickable;
        this.width = width;
        this.textColor = textColor
        this.boxColor = boxColor;
        this.borderColor = borderColor;
        this.selectionColor = selectionColor;
        this.beingSelected = false;
    }
    Start(){
        this.transform = this.parentObject.GetComponent(Transform);
        this.transform.x = this.startX;
        this.transform.y = this.startY;
        ctx.lineWidth = 3;
    }
    PostRenderUpdate(){
        //check if mouse is inside of box. Only do this is isclickable


        //Input.mousePosition.x, Input.mousePosition.y
        if(this.hasBox && this.width != undefined){
            let drawPosX = this.transform.x-5;
            let drawPosY = this.transform.y - 46
            let drawWidth = this.width;
            let drawHeight = 60
            if(this.isClickable){
                if(Input.mousePosition.x > drawPosX && Input.mousePosition.x < drawPosX + drawWidth){
                    if(canvas.height-Input.mousePosition.y > drawPosY && canvas.height-Input.mousePosition.y < drawPosY + drawHeight){
                        this.beingSelected = true;
                    }
                    else this.beingSelected = false;
                }
                else this.beingSelected = false;
            }
            if(this.boxColor != undefined){
                ctx.fillStyle = this.boxColor;
            }
            else ctx.fillStyle = "black";
            if(this.beingSelected){
                ctx.fillStyle = this.selectionColor;
            }
            ctx.fillRect(drawPosX, drawPosY, drawWidth, drawHeight);
            ctx.fillStyle = this.borderColor;
            ctx.strokeRect(drawPosX, drawPosY, drawWidth, drawHeight);
        }

        if(this.parentObject.name == "MPH Text"){
            this.text = Math.abs(Math.round(player.GetComponent(PlayerController).mph)) + " MPH";
        }
        if(this.parentObject.name == "Level Text"){
            this.text = LevelLoader.currentLevelName;
        }
        ctx.font = "48px serif";
        if(this.textColor != undefined){
            ctx.fillStyle = this.textColor;
        }
        else ctx.fillStyle = "black";
        if(this.width != undefined){
            ctx.fillText(this.text, this.transform.x, this.transform.y, this.width);
        }
        else ctx.fillText(this.text, this.transform.x, this.transform.y);

    }
}
