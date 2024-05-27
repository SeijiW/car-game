let buffer = document.createElement('canvas');
let bufferCtx = buffer.getContext('2d');

class ImageRenderer{
    constructor(image, pixelsPerUnit, antialiasingEnabled, opacity, tint, flip, radius){
        this.image = image;
        this.renderInPost = false;

        this.fillColor; //define this manually if it's type circle and you want to change the fill color.

        this.parentObject = null;
        this.transform = undefined
        this.pixelsPerUnit= pixelsPerUnit
        this.antialiasingEnabled = false;
        this.tint = tint;
        this.cameraTransform
        this.cameraController;
        this.flip = flip
        if(this.flip != true && this.flip != false) this.flip = false;
        if(antialiasingEnabled){
            this.antialiasingEnabled = true;
        }
        this.opacity = opacity;
        if(this.opacity == undefined){
            this.opacity = 1;
        }
        this.rotInRads = 0;
        if(image == "circle" && radius != undefined){
            this.radius = radius;
        }
        else if(image == "circle"){
            radius = 1;
        }
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
    RenderUpdate(){
        this.rotInRads = degToRad(-this.transform.r + this.cameraTransform.r);
        this.camRotInRads = degToRad(this.cameraTransform.r)
        ctx.globalAlpha = this.opacity;
        if(this.opacity == undefined) ctx.globalAlpha = 1
        ctx.imageSmoothingEnabled = this.antialiasingEnabled
        let sx;
        let sy;
        if(this.image == "circle"){
            sx = (standardUnitSize * this.transform.sx * this.radius/2) * this.cameraTransform.sx;
            sy = (standardUnitSize * this.transform.sy * this.radius/2) * this.cameraTransform.sx;
            ctx.lineWidth = 5;
            if(this.fillColor == undefined){
                ctx.fillStyle = 'rgb(160,160,160)';
            }
            else{
                ctx.fillStyle = this.fillColor;
            }
            ctx.strokeStyle = '#003300';
        }
        else{
            sx = ((standardUnitSize * this.transform.sx * this.image.width) / this.pixelsPerUnit) * this.cameraTransform.sx;
            sy = ((standardUnitSize * this.transform.sy * this.image.height) / this.pixelsPerUnit) * this.cameraTransform.sx;
        }

        let standardDrawX;
        let standardDrawY;
        if(this.image == "circle"){
            standardDrawX = (this.centralizeImagePoint(((this.transform.x - this.cameraTransform.x) * this.cameraTransform.sx) * standardUnitSize, this.radius) + (canvas.width / 2))
            standardDrawY = (this.centralizeImagePoint(((-this.transform.y + this.cameraTransform.y) * this.cameraTransform.sx) * standardUnitSize, this.radius) + (canvas.height / 2))
        }
        else{
            standardDrawX = (this.centralizeImagePoint(((this.transform.x - this.cameraTransform.x) * this.cameraTransform.sx) * standardUnitSize, sx) + (canvas.width / 2))
            standardDrawY = (this.centralizeImagePoint(((-this.transform.y + this.cameraTransform.y) * this.cameraTransform.sx) * standardUnitSize, sy) + (canvas.height / 2))
        }
        let drawOrigin;
        if(this.image == "circle") drawOrigin = {
            "x" : standardDrawX + (this.radius / 2) ,
            "y" : standardDrawY + (this.radius / 2)
        }
        else drawOrigin = {
            "x" : standardDrawX + (sx / 2) ,
            "y" : standardDrawY + (sy / 2)
        }
        if(this.transform.r == 0 && this.cameraTransform.r == 0){
            if(this.isOnscreenCheck(drawOrigin.x, drawOrigin.y, sx, sy) || this.image == "circle"){
                if(this.flip){
                    ctx.save();
                    ctx.translate(drawOrigin.x, drawOrigin.y);
                    ctx.scale(this.flip ? -1 : 1, 1);
                    ctx.translate(-drawOrigin.x, -drawOrigin.y);
                }
                if(this.image == "circle"){
                    ctx.beginPath();
                    ctx.arc(standardDrawX, standardDrawY, sx, 0, 2 * Math.PI, false);
                    ctx.fill();
                    //ctx.stroke();
                }
                else ctx.drawImage(this.image, standardDrawX, standardDrawY, sx, sy);
                this.drawingTint(this, sx, sy, standardDrawX, standardDrawY);
                if(this.flip)ctx.restore();
            }
        }
        else{
            //standardRotated is where camera rotation affects draw position
            let originCenteredDOrigX = (drawOrigin.x - (canvas.width/2))
            let originCenteredDOrigY = (drawOrigin.y - (canvas.height/2))
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
            if(this.isOnscreenCheck(drawOriginRotated.x, drawOriginRotated.y, sx, sy) || this.image == "circle"){
                let standardRotated = {
                    "x" : drawOriginRotated.x - (sx / 2) ,
                    "y" : drawOriginRotated.y - (sy / 2)
                }
                if(this.image == "circle"){
                    standardRotated = {
                        "x" : drawOriginRotated.x - (this.radius / 2) ,
                        "y" : drawOriginRotated.y - (this.radius / 2)
                    }
                }
                //rotate canvas
                ctx.save();
                ctx.translate(drawOriginRotated.x, drawOriginRotated.y);
                ctx.scale(this.flip ? -1 : 1, 1);
                if(!this.flip)
                ctx.rotate(this.rotInRads);
                else
                ctx.rotate(-this.rotInRads);
                ctx.translate(-drawOriginRotated.x, -drawOriginRotated.y);
                //flip canvas
                //draw
                if((this.tint == undefined || this.tint[3] == 0)){
                    if(this.image == "circle"){
                        ctx.beginPath();
                        ctx.arc(standardRotated.x, standardRotated.y, sx, 0, 2 * Math.PI, false);
                        ctx.fill();
                        //ctx.stroke();
                    }
                    else ctx.drawImage(this.image, standardRotated.x, standardRotated.y, sx, sy);
                }
                //restore
                ctx.restore();
                this.drawingTint(this, sx, sy, standardRotated.x, standardRotated.y);   
            }
        }
    }
    centralizeImagePoint(point, bound){
        return point - (bound/2)
    }
    drawingTint(renderer, sx, sy, drawX, drawY) {
        if (renderer.tint == undefined || renderer.tint[3] == 0) {
          return;
        }
        buffer.width = canvas.width;
        buffer.height = canvas.height;

        bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
        bufferCtx.fillStyle = `rgba(${renderer.tint.join(",")})`;
        bufferCtx.fillRect(0, 0, buffer.width, buffer.height);
        bufferCtx.globalCompositeOperation = "destination-atop";
        if(renderer.transform.r != 0){
            bufferCtx.save();
            bufferCtx.translate(drawX + (sx / 2), drawY + (sy / 2));
            bufferCtx.scale(this.flip ? -1 : 1, 1);
            if(!this.flip)
            bufferCtx.rotate(this.rotInRads);
            else
            bufferCtx.rotate(-this.rotInRads);
            bufferCtx.drawImage(renderer.image, -sx / 2, -sy / 2, sx, sy);
            ctx.drawImage(buffer, 0, 0);
            bufferCtx.restore();
        }
        else{   
            bufferCtx.drawImage(renderer.image, drawX, drawY, sx, sy);
            ctx.drawImage(buffer, 0, 0);
        }
    }
    isOnscreenCheck(originDrawX, originDrawY, sx, sy){
        //this makes sure image only renders when on screen
        let padding = 0
        let objectSize = Math.sqrt((sx**2) + (sy**2)) - padding //distance between two diagonal corners of the image
        if(originDrawX + objectSize > 0 && originDrawX - objectSize < canvas.width && originDrawY + objectSize > 0 && originDrawY - objectSize < canvas.height){
            return true;
        }
        else return false;
    }
}
