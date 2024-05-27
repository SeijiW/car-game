class Button{
    constructor(tag){
        this.tag = tag;
        this.textComponent;
    }
    Start(){
        this.textComponent = this.parentObject.GetComponent(TextDisplay);
    }
    Update(){
        if(this.tag == "LoadLevel1" && this.textComponent.beingSelected && Input.mouseJustDown){
            LevelSetUp(true)
            LevelLoader.currentLevelName = LevelLoader.allLevelsList[0].name;
            LevelLoader.LoadLevel(LevelLoader.allLevelsList[0].code);
            createObject(new Object("Tutorial Text", [new TextDisplay("Up arrow to accelerate. Right and left arrows to steer. Back arrow or space to break", 10, 50, 1180, true, false, "white", "#1A1A1A", "white")]));
        }
        else if(this.tag == "Retry" && this.textComponent.beingSelected && Input.mouseJustDown){
            LevelLoader.ReloadCurrentLevel();
        }
        else if(this.tag == "Next Level" && this.textComponent.beingSelected && Input.mouseJustDown){
            LevelLoader.PlayNextLevel();
        }
    }
}