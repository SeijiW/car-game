class Key {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.pressed = false;
        this.down = false;
        this.up = false;
    }
}
class Input{
    static supportedKeys = [new Key("z", 90), new Key("x", 88), new Key("w", 87), new Key("a", 65), new Key("s", 83), new Key("d", 68), new Key("left", 37), new Key("up", 38), new Key("right", 39), new Key("down", 40), new Key("g", 71), new Key("space", 32), new Key("-", 189), new Key("=", 187), new Key("3", 51), new Key("4", 52), new Key("1", 49), new Key("e", 69)];
    static keyDowns = [];
    static keyStays = [];
    static CommandDown = false;
    static HorizontalWASD = 0;
    static VerticalWASD = 0;
    static HorizontalArrows = 0;
    static VerticalArrows = 0;
    static mouseDown = false;
    static mouseJustDown = false;
    static mousePosition = {
        "x" : 0,
        "y" : 0
    }
    static GetKey(keyName){
        for(let i = 0; i < Input.supportedKeys.length; i++){
            if(Input.supportedKeys[i].name == keyName){
                if(Input.supportedKeys[i].pressed){
                    return true
                } else return false
            }
        }
        return undefined
    }
    static GetKeyDown(keyName){
        for(let i = 0; i < Input.supportedKeys.length; i++){
            if(Input.supportedKeys[i].name == keyName){
                if(Input.supportedKeys[i].down){
                    return true
                } else return false
            }
        }
    }
    static GetKeyUp(keyName){
        for(let i = 0; i < Input.supportedKeys.length; i++){
            if(Input.supportedKeys[i].name == keyName){
                if(Input.supportedKeys[i].up){
                    return true
                } else return false
            }
        }
        return undefined
    }
    static InputDown(evt){
        if(evt.keyCode == 91){
            Input.CommandDown = true;
        }
        if(!Input.CommandDown){
            for(let i = 0; i < Input.supportedKeys.length; i++){
                if(evt.keyCode == Input.supportedKeys[i].value){
                    Input.supportedKeys[i].pressed = true;
                    Input.supportedKeys[i].down = true;
                }
            }
        }
    }
    static InputUp(evt){
        if(evt.keyCode == 91){
            Input.CommandDown = false;
        }
        if(!Input.CommandDown){
            for(let i = 0; i < Input.supportedKeys.length; i++){
                if(evt.keyCode == Input.supportedKeys[i].value){
                    Input.supportedKeys[i].pressed = false;
                    Input.supportedKeys[i].up = true;
                }
            }
        }
    }
    static SetAxes(){
        //function is being run every frame in GameLoop()
        Input.HorizontalWASD = 0
        if(Input.GetKey('a')){
            Input.HorizontalWASD--
        }
        if(Input.GetKey('d')){
            Input.HorizontalWASD++
        }
        Input.VerticalWASD = 0
        if(Input.GetKey('w')){
            Input.VerticalWASD++
        }
        if(Input.GetKey('s')){
            Input.VerticalWASD--
        }

        Input.HorizontalArrows = 0
        if(Input.GetKey('left')){
            Input.HorizontalArrows--
        }
        if(Input.GetKey('right')){
            Input.HorizontalArrows++
        }
        Input.VerticalArrows = 0
        if(Input.GetKey('up')){
            Input.VerticalArrows++
        }
        if(Input.GetKey('down')){
            Input.VerticalArrows--
        }
    }
    static MouseMove(evt){
        let rect = canvas.getBoundingClientRect();
        Input.mousePosition.x = evt.clientX - rect.left;
        Input.mousePosition.y = -((evt.clientY - rect.top) - canvas.height);;
    }
    static MouseDown(){
        Input.mouseDown = true;
        Input.mouseJustDown = true;
    }
    static MouseUp(){
        Input.mouseDown = false;
    }
}
