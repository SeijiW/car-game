class Ray{
    constructor(activelyCheck, xOffset, yOffset, length, direction){
        if(activelyCheck) this.activelyCheck = true; else this.activelyCheck = false;

        this.active = true;

        this.worldX;
        this.worldY;
        this.worldEndX;
        this.worldEndY;

        this.parentObject = null;
        this.cameraTransform;
        this.transform;
        this.colliding = false;

        if(xOffset == undefined) this.xOffset = 0;
        else this.xOffset = xOffset;
        if(yOffset == undefined) this.yOffset = 0;
        else this.yOffset = yOffset;
        if(length == undefined) this.length = "infinite"
        else this.length = length;
        if(direction == undefined) this.direction = 0;
        else this.direction = direction;
    }
    Start(){
        this.transform = this.parentObject.GetComponent(Transform);
        for(let i = 0; i < objectList.length; i++){
            if(objectList[i].tag1 == "camera"){
                this.cameraTransform = objectList[i].GetComponent(Transform);
                break
            }
        }
    }
    LaterUpdate(){
        this.rotInRads = degToRad(-this.transform.r + this.cameraTransform.r);
        this.camRotInRads = degToRad(this.cameraTransform.r)

        this.worldX = this.transform.x + this.xOffset;
        this.worldY = this.transform.y + this.yOffset;
        if(this.length == "infinite"){
            this.worldEndX = this.worldX + (Math.cos(degToRad(this.direction+this.transform.r+.0001)) * (100000/this.cameraTransform.sx));
            this.worldEndY = this.worldY + (Math.sin(degToRad(this.direction+this.transform.r+.0001)) * (100000/this.cameraTransform.sx));
        }
        else{
            this.worldEndX = this.worldX + (Math.cos(degToRad(this.direction+this.transform.r+.0001)) * this.length);
            this.worldEndY = this.worldY + (Math.sin(degToRad(this.direction+this.transform.r+.0001)) * this.length);
        }
        
        this.colliding = false;
    }
    RenderUpdate(){
        ctx.beginPath();
        let finalDrawX1;
        let finalDrawX2;
        let finalDrawY1;
        let finalDrawY2;
        //start point calculations
        let startDrawX = ((this.worldX - this.cameraTransform.x) * this.cameraTransform.sx) * standardUnitSize + (canvas.width / 2)
        let startDrawY = ((-this.worldY + this.cameraTransform.y) * this.cameraTransform.sx) * standardUnitSize + (canvas.height / 2)
        if(this.cameraTransform.r == 0){
            finalDrawX1 = startDrawX;
            finalDrawY1 = startDrawY;
        }
        else{
            let originCenteredDOrigX = (startDrawX - (canvas.width/2))
            let originCenteredDOrigY = (startDrawY - (canvas.height/2))
            let origMagnitude = Math.sqrt((originCenteredDOrigX**2) + (originCenteredDOrigY**2));
            let origDirection;
            if(originCenteredDOrigX >= 0){
                origDirection = Math.atan(originCenteredDOrigY/originCenteredDOrigX);
            }
            else{
                origDirection = Math.atan(originCenteredDOrigY/originCenteredDOrigX) + Math.PI;
            }
            if(isNaN(origDirection)){
                origDirection = 0
            }
            let drawOriginRotated = {
                "x" : (Math.cos(origDirection + this.camRotInRads) * origMagnitude)+(canvas.width/2),
                "y" : (Math.sin(origDirection + this.camRotInRads) * origMagnitude)+(canvas.height/2)
            }
            finalDrawX1 = drawOriginRotated.x;
            finalDrawY1 = drawOriginRotated.y;
        }
        //end point calculations
        let endDrawX = ((this.worldEndX - this.cameraTransform.x) * this.cameraTransform.sx) * standardUnitSize + (canvas.width / 2);
        let endDrawY = ((-this.worldEndY + this.cameraTransform.y) * this.cameraTransform.sx) * standardUnitSize + (canvas.height / 2);
        if(this.cameraTransform.r == 0){
            finalDrawX2 = endDrawX;
            finalDrawY2 = endDrawY;
        }
        else{
            let originCenteredDOrigX = (endDrawX - (canvas.width/2))
            let originCenteredDOrigY = (endDrawY - (canvas.height/2))
            let origMagnitude = Math.sqrt((originCenteredDOrigX**2) + (originCenteredDOrigY**2));
            let origDirection;
            if(originCenteredDOrigX >= 0){
                origDirection = Math.atan(originCenteredDOrigY/originCenteredDOrigX);
            }
            else{
                origDirection = Math.atan(originCenteredDOrigY/originCenteredDOrigX) + Math.PI;
            }
            if(isNaN(origDirection)){
                origDirection = 0
            }
            let drawOriginRotated = {
                "x" : (Math.cos(origDirection + this.camRotInRads) * origMagnitude)+(canvas.width/2),
                "y" : (Math.sin(origDirection + this.camRotInRads) * origMagnitude)+(canvas.height/2)
            }
            finalDrawX2 = drawOriginRotated.x;
            finalDrawY2 = drawOriginRotated.y;
        }

        if(this.colliding) ctx.strokeStyle = hitBoxColorColliding;
        else ctx.strokeStyle = hitBoxColor;
        ctx.lineWidth = hitBoxLineWidth;
        ctx.moveTo(finalDrawX1, finalDrawY1);
        ctx.lineTo(finalDrawX2, finalDrawY2);
        ctx.stroke();
    }
}
