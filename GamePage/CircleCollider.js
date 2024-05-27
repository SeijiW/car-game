//this is only for circle on the CursorFollower levelList static object which are all rectangles.
class CircleCollider{
    constructor(radius, offsetX, offsetY){
        this.radius = radius;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.colliding = false;
        this.worldX = 50000;
        this.worldY = 50000;

        this.hasStarted = false;
    }
    Start(){
        if(!this.hasStarted){
            this.transform = this.parentObject.GetComponent(Transform);
        }
        this.hasStarted = true;
    }
    LaterUpdate(){
        //calculate origin
        if((this.offsetX == 0 && this.offsetY == 0) || this.transform.r == 0){
            this.worldX = this.transform.x + this.offsetX;
            this.worldY = this.transform.y + this.offsetY;
        }
        else{
            let magnitude = Math.sqrt(this.offsetX**2 + this.offsetY**2);
            let direction;
            if(this.offsetX >= 0){
                direction = Math.atan(this.offsetY/this.offsetX);
            }
            else{
                direction = Math.atan(this.offsetY/this.offsetX) + Math.PI;
            }
            if(isNaN(direction)){
                direction = 0
            }
            this.worldX = this.transform.x + (Math.cos(degToRad(this.transform.r) + direction) * magnitude);
            this.worldY = this.transform.y + (Math.sin(degToRad(this.transform.r) + direction) * magnitude);
        }
        //calculate if it is colliding with levelList
        this.colliding = false;
        for(let i = 0; i < LevelLoader.levelList.length; i++){
            if(CircleTouchingSquare(LevelLoader.sizeOfBoxes, LevelLoader.levelList[i].GetComponent(Transform).x, LevelLoader.levelList[i].GetComponent(Transform).y, this.radius, this.worldX, this.worldY)){
                if(LevelLoader.levelList[i].name == "Finish"){
                    player.GetComponent(PlayerController).finishedLevel = true;
                }
                else{
                    this.colliding = true;
                    break;
                }
            }
        }
    }
}
function CircleTouchingSquare(squareLength, squareOriginX, squareOriginY, circleRadius, circleOriginX, circleOriginY) {
    // Calculate the half length of the square side
    let halfSquareLength = squareLength / 2;

    // Calculate the bounds of the square
    let squareMinX = squareOriginX - halfSquareLength;
    let squareMaxX = squareOriginX + halfSquareLength;
    let squareMinY = squareOriginY - halfSquareLength;
    let squareMaxY = squareOriginY + halfSquareLength;

    // Find the closest point on the square to the circle's center
    let closestX = Math.max(squareMinX, Math.min(circleOriginX, squareMaxX));
    let closestY = Math.max(squareMinY, Math.min(circleOriginY, squareMaxY));

    // Calculate the distance between the circle's center and this closest point
    let distanceX = circleOriginX - closestX;
    let distanceY = circleOriginY - closestY;
    let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

    // Determine if the circle intersects the square
    return distanceSquared <= (circleRadius * circleRadius);
}