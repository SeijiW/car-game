let hitBoxColor = "rgb(0,0,255)";
let hitBoxColorColliding = "rgb(255,0,0)";
let hitBoxLineWidth = 4
let hitBoxesVisible = true;


function ConvertToEquation(x1, y1, x2, y2){
    let slope = (y2-y1)/(x2-x1);
    if(x2-x1 == 0){
        slope = "vertical";
    }
    let b = ((-x1*slope) + y1);
    if(slope == "vertical"){
        return {
            "m" : "vertical",
            "x" : x1
        };
    }
    else return {
        "m" : slope,
        "b" : b
    };
}
function findCircleLineConvergence(originX, originY, radius, lineEq) {
    // Line equation: y = mx + b
    const m = lineEq.m;
    const b = lineEq.b;

    // Coefficients for the quadratic equation
    const a = 1 + m ** 2;
    const bCoeff = 2 * (m * b - m * originY - originX);
    const c = originX ** 2 + (originY - b) ** 2 - radius ** 2;

    // Calculate discriminant
    const discriminant = bCoeff ** 2 - 4 * a * c;

    // Check if there are real solutions
    if (discriminant < 0) {
        return []; // No real solutions, the line does not intersect the circle
    }

    // Calculate intersection points
    const x1 = (-bCoeff + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-bCoeff - Math.sqrt(discriminant)) / (2 * a);

    const y1 = m * x1 + b;
    const y2 = m * x2 + b;

    // Return an array of intersection points
    return [
        { "x": x1, "y": y1 },
        { "x": x2, "y": y2 }
    ];
}
function findLineConvergence(eq1, eq2){
    /*m1(x) + b1 = m2(x) + b2
    m1(x) = m2(x) + b2 - b1
    m1(x) - m2(x) = b2 - b1
    (m1 - m2)(x) = b2 - b1*/
    let x;
    let y;
    let isVertical = false;
    if(eq1.m == "vertical" && eq2.m == "vertical"){
        isVertical = true;
        return{
            "x" : undefined, "y" : undefined
        };
    }
    else if(eq1.m == "vertical"){
        x = eq1.x;
        y = (eq2.m * eq1.x) + eq2.b;
        isVertical = true;
    }
    else if(eq2.m == "vertical"){
        x = eq2.x;
        y = (eq1.m * eq2.x) + eq1.b;
        isVertical = true;
    }
    else{
        x = (eq2.b - eq1.b) / (eq1.m - eq2.m);
        y = (eq1.m * x) + eq1.b;
    }
    return{
        "x" : x,
        "y" : y,
        "vertical" : isVertical
    };
}

class BoxCollider{
    constructor(activelyCheck, sx, sy, ox, oy, r, isCircle){
        if(activelyCheck) this.activelyCheck = true; else this.activelyCheck = false;
        if(isCircle){
            this.isCircle = true;
        }
        else this.isCircle = false;

        this.active = true;

        this.colliding = false;

        this.transform;
        this.sx = sx;
        this.sy = sy;
        this.ox = ox;
        this.oy = oy;
        this.r = r;
        if(this.sx == undefined) this.sx = 1;
        if(this.sy == undefined) this.sy = 1;
        if(this.ox == undefined) this.ox = 0;
        if(this.oy == undefined) this.oy = 0;
        if(this.r == undefined) this.r = 0;

        this.worldX = 0;
        this.worldY = 0;
        this.worldR = 0;
        this.world_sx = 1;
        this.world_sy = 1;

        this.cameraTransform;
        this.parentObject = null;

        this.TL;
        this.TR;
        this.BL;
        this.BR;
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
    LateUpdate(){
        //set this.world values
        this.world_sx = this.transform.sx * this.sx;
        this.world_sy = this.transform.sy * this.sy;
        this.worldR = this.transform.r + this.r;
        if((this.ox == 0 && this.oy == 0) || this.transform.r == 0){
            this.worldX = this.transform.x + this.ox;
            this.worldY = this.transform.y + this.oy;
        }
        else{
            let magnitude = Math.sqrt(this.ox**2 + this.oy**2);
            let direction;
            if(this.ox >= 0){
                direction = Math.atan(this.oy/this.ox);
            }
            else{
                direction = Math.atan(this.oy/this.ox) + Math.PI;
            }
            if(isNaN(direction)){
                direction = 0
            }
            this.worldX = this.transform.x + (Math.cos(degToRad(this.transform.r) + direction) * magnitude);
            this.worldY = this.transform.y + (Math.sin(degToRad(this.transform.r) + direction) * magnitude);
        }
        this.CalculateVertices();
    }
    LaterUpdate(){
        /*for(let i = 0; i < objectList.length; i++){
            let collision = objectList[i].GetComponent(BoxCollider);
            if(collision != undefined){//if u make other types of colliders, add them to the check with a separate if statement.
                
            }
        }*/
        this.colliding = false;
    }
    CalculateVertices(){
        //box vertice calculation
        let ssx = this.world_sx/2;
        let ssy = this.world_sy/2;
        if(this.transform.r == 0){
            this.TL = {
                "x": this.worldX - ssx,
                "y": this.worldY + ssy
            }
            this.BL = {
                "x": this.worldX - ssx,
                "y": this.worldY - ssy
            }
            this.TR = {
                "x": this.worldX + ssx,
                "y": this.worldY + ssy
            }
            this.BR = {
                "x": this.worldX + ssx,
                "y": this.worldY - ssy
            }
        }
        else{
            let magnitude = Math.sqrt(ssx**2+ssy**2);

            let direction = Math.atan(ssy/-ssx) + Math.PI;
            this.TL = {
                "x": this.worldX + (Math.cos(direction+degToRad(this.worldR))*magnitude),
                "y": this.worldY + (Math.sin(direction+degToRad(this.worldR))*magnitude)
            };
            direction = Math.atan(ssy/ssx) + Math.PI;
            this.BL = {
                "x": this.worldX + (Math.cos(direction+degToRad(this.worldR))*magnitude),
                "y": this.worldY + (Math.sin(direction+degToRad(this.worldR))*magnitude)
            };
            direction = Math.atan(ssy/ssx);
            this.TR = {
                "x": this.worldX + (Math.cos(direction+degToRad(this.worldR))*magnitude),
                "y": this.worldY + (Math.sin(direction+degToRad(this.worldR))*magnitude)
            };
            direction = Math.atan(-ssy/ssx);
            this.BR = {
                "x": this.worldX + (Math.cos(direction+degToRad(this.worldR))*magnitude),
                "y": this.worldY + (Math.sin(direction+degToRad(this.worldR))*magnitude)
            };
        }
    }
    RenderUpdate(){
        //render hitbox
        if(this.colliding)ctx.strokeStyle = hitBoxColorColliding;
        else ctx.strokeStyle = hitBoxColor;
        ctx.lineWidth = hitBoxLineWidth;
        if(hitBoxesVisible){
            this.rotInRads = degToRad(-this.worldR + this.cameraTransform.r);
            this.camRotInRads = degToRad(this.cameraTransform.r)
            let sx = standardUnitSize * this.world_sx * this.cameraTransform.sx;
            let sy = standardUnitSize * this.world_sy * this.cameraTransform.sx;
            if(this.isCircle){
                sx /=2;
                sy /=2;
            }
    
            let standardDrawX = (this.centralizeImagePoint(((this.worldX - this.cameraTransform.x) * this.cameraTransform.sx) * standardUnitSize, sx) + (canvas.width / 2))
            let standardDrawY = (this.centralizeImagePoint(((-this.worldY + this.cameraTransform.y) * this.cameraTransform.sx) * standardUnitSize, sy) + (canvas.height / 2))
            if(this.isCircle){
                standardDrawX = (this.centralizeImagePoint(((this.worldX - this.cameraTransform.x) * this.cameraTransform.sx) * standardUnitSize, 0) + (canvas.width / 2))
                standardDrawY = (this.centralizeImagePoint(((-this.worldY + this.cameraTransform.y) * this.cameraTransform.sx) * standardUnitSize, 0) + (canvas.height / 2))   
            }
            let drawOrigin = {
                "x" : standardDrawX + (sx / 2) ,
                "y" : standardDrawY + (sy / 2)
            }
            if(this.transform.r + this.r == 0 && this.cameraTransform.r == 0){
                if(this.isOnscreenCheck(drawOrigin.x, drawOrigin.y, sx, sy)){
                    ctx.beginPath();
                    if(this.isCircle) ctx.arc(standardDrawX, standardDrawY, sx, 0, 2 * Math.PI, false);
                    else ctx.rect(standardDrawX, standardDrawY, sx, sy);
                    ctx.stroke();
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
                if(this.isOnscreenCheck(drawOriginRotated.x, drawOriginRotated.y, sx, sy)){
                    let standardRotated = {
                        "x" : drawOriginRotated.x - (sx / 2) ,
                        "y" : drawOriginRotated.y - (sy / 2)
                    }
                    //rotate canvas
                    ctx.save();
                    ctx.translate(drawOriginRotated.x, drawOriginRotated.y);
                    ctx.rotate(this.rotInRads);
                    ctx.translate(-drawOriginRotated.x, -drawOriginRotated.y);
                    //draw
                    ctx.beginPath();
                    if(this.isCircle) ctx.arc(standardRotated.x, standardRotated.y, sx, 0, 2 * Math.PI, false);
                    else ctx.rect(standardRotated.x, standardRotated.y, sx, sy);
                    ctx.stroke();
                    //restore
                    ctx.restore(); 
                }
            }
        }
    }
    centralizeImagePoint(point, bound){
        return point - (bound/2)
    }
    isOnscreenCheck(originDrawX, originDrawY, sx, sy){
        return true;
        //this makes sure image only renders when on screen
        let padding = 0
        let objectSize = Math.sqrt((sx**2) + (sy**2)) - padding //distance between two diagonal corners of the image
        if(originDrawX + objectSize > 0 && originDrawX - objectSize < canvas.width && originDrawY + objectSize > 0 && originDrawY - objectSize < canvas.height){
            return true;
        }
        else return false;
    }
}

/*
rendering of BoxCollider


*/
