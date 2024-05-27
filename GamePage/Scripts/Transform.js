class Transform{
    constructor(x, y, sx, sy, r){
        //parent transform refers to a separate object from this one, that this object is tied to in terms of its transform. Like parent and child in unity
        this.parentTransform = null;
        this.x = x
        this.y = y
        //local variables only used if there is a parent
        this.localx = null;
        this.localy = null;
        this.localr = null;

        this.lastFrameParentX = 0;
        this.lastFrameParentY = 0;
        this.lastFrameParentR = 0;

        this.r = r
        this.sx = sx
        this.sy = sy
        if(this.r == undefined){
            this.r = 0
        }
        if(this.sx == undefined){
            this.sx = 1
        }
        if(this.sy == undefined){
            this.sy = 1
        }
    }
    LateUpdate(){
        if(this.parentTransform != null){
            this.x -= this.lastFrameParentX - this.parentTransform.x;
            this.y -= this.lastFrameParentY - this.parentTransform.y;

            //convert parentAsOriginX to polar, then add localr to angle, then convert back to rectangular
            let parentAsOriginX = this.x - this.parentTransform.x;
            let parentAsOriginY = this.y - this.parentTransform.y;

            let parentAsOriginMagnitude = Math.sqrt(parentAsOriginX**2 + parentAsOriginY**2);
            let parentAsOriginDirection;
            if(parentAsOriginX >= 0){
                parentAsOriginDirection = Math.atan(parentAsOriginY/parentAsOriginX);
            }
            else{
                parentAsOriginDirection = Math.atan(parentAsOriginY/parentAsOriginX) + Math.PI;
            }
            if(isNaN(parentAsOriginDirection)){
                parentAsOriginDirection = 0
            }
            this.x = (Math.cos(parentAsOriginDirection - degToRad(this.lastFrameParentR - this.parentTransform.r))) * (parentAsOriginMagnitude) + this.parentTransform.x;
            this.y = (Math.sin(parentAsOriginDirection - degToRad(this.lastFrameParentR - this.parentTransform.r))) * (parentAsOriginMagnitude) + this.parentTransform.y;
            this.r -= this.lastFrameParentR - this.parentTransform.r;



            this.localx = this.x - this.parentTransform.x;
            this.localy = this.y - this.parentTransform.y;
            this.localr = this.r - this.parentTransform.r;

            this.lastFrameParentX = this.parentTransform.x;
            this.lastFrameParentY = this.parentTransform.y;
            this.lastFrameParentR = this.parentTransform.r;
        }
    }
}
