class CursorFollower{
    constructor(){
        this.transform
        this.placeMode = "draw";
        this.drawMode = "normal";
    }
    Start(){
        this.transform = this.parentObject.GetComponent(Transform);
    }
    Update(){
        if(Input.GetKeyDown("e")){
            if(this.placeMode == "draw"){
                this.placeMode = "erase";
            }
            else this.placeMode = "draw";
        }
        if(Input.GetKey("z")){
            this.drawMode = "finish"
        }
        else this.drawMode = "normal";
    }
    LaterUpdate(){
        //following mouse
        if(Input.mousePosition.x == 0){
            this.transform.x = -500000;
        }
        else{
            let newPos = ScreenToWorldPoint(Input.mousePosition.x, Input.mousePosition.y);
            this.transform.x = newPos.x;
            this.transform.y = newPos.y;
        }
        //rounding position

        this.transform.x = Math.round(this.transform.x/4)*4;
        this.transform.y = Math.round(this.transform.y/4)*4;
        /*this.transform.x = Math.round(this.transform.x) ;
        this.transform.y = Math.round(this.transform.y) ;*/
        //placing and erasing
        if(Input.mouseDown){
            let blockInThisSpot = false;
            for(let i = 0; i < LevelLoader.levelList.length; i++){
                //checks if object already in that location
                if(LevelLoader.levelList[i].GetComponent(Transform).x == this.transform.x && LevelLoader.levelList[i].GetComponent(Transform).y == this.transform.y){
                    if(this.placeMode == "erase"){
                        destroy(LevelLoader.levelList[i]);
                        LevelLoader.levelList.splice(i,1);
                    }
                    blockInThisSpot = true;
                    break;
                }
            }
            if(this.placeMode == "draw"){
                if(!blockInThisSpot){
                    if(this.drawMode == "normal")
                    LevelLoader.levelList.push(createObject(new Object("Concrete", [new ImageRenderer(ConcreteIMG, 377), new Transform(this.transform.x,this.transform.y,LevelLoader.sizeOfBoxes,LevelLoader.sizeOfBoxes,0)])));
                    if(this.drawMode == "finish")
                    LevelLoader.levelList.push(createObject(new Object("Finish", [new ImageRenderer(FinishIMG, 377), new Transform(this.transform.x,this.transform.y,LevelLoader.sizeOfBoxes,LevelLoader.sizeOfBoxes,0)])));
                }
            }
        }
    }
}
