/*createObject(new Object("color", [new ImageRenderer(ColorIMG, 225, true), new Transform(0,0,1,1,0)]));
createObject(new Object("color", [new ImageRenderer(ColorIMG, 225, true), new Transform(2,0,2,2,45)]));
createObject(new Object("color", [new ImageRenderer(ColorIMG, 225, true), new Transform(4,4,8,2,70)]));*/
//Sample object creation: createObject(new Object("color", [new ImageRenderer(ColorIMG, 225, true), new BoxCollider(), new Transform(3,0,1,1,0), new TestObject()]));
let player;
let circly;
let circlyTransform;

player = createObject(new Object("player", [new ImageRenderer(SquareIMG, 16, false), new BoxCollider(false, .5,.5,0,0,0), new PlayerController(), new Ray(true,0, 0, undefined, 90), ], "Player"), 0, -2, 1, 1, 0);
player.GetComponent(BoxCollider).active = false;

circly = createObject(new Object("circlePointer", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new Transform(5,0,.3,.3,0)], "circle"));
circly.GetComponent(ImageRenderer).fillColor = "red";
circlyTransform = circly.GetComponent(Transform);

function LoadSample1(){
    gameLoopHasStarted = false;
    objectList = [];
    
    for(let i = -10; i < 10; i++){
        for(let e = -10; e < 10; e++){
            createObject(new Object("grid", [new ImageRenderer(GridPieceIMG, 88), new Transform((i-(1/8))*4 -(2/88),(e-(1/8))*4 - (2/88),4,4,0)]));
        }
    }
    createObject(new Object("another ray", [new Ray(false, 0, 0, 5, 110)], "ray"), 4, -3, 1, 1, 0);
    createObject(new Object("another ray", [new Ray(false, 0, 0, 5, 15)], "ray"), 3, 1, 1, 1, 0);
    createObject(new Object("another ray", [new Ray(false, 0, 0, 10, -190)], "ray"), 10, 1, 1, 1, 0);
    createObject(new Object("another ray", [new Ray(false, 0, 0, 10, -90)], "ray"), -5, 4, 1, 1, 0);
    
    createObject(new Object("square", [new ImageRenderer(SquareIMG, 8, true), new BoxCollider(false), new Transform(1,0,2,1,0)], "square"));
    createObject(new Object("square", [new ImageRenderer(SquareIMG, 8, true), new BoxCollider(false), new Transform(-1.5,1,4,5,15)], "square"));
    createObject(new Object("circle", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new BoxCollider(false, undefined, undefined, undefined, undefined, undefined, true), new Transform(5,0,2,2,0)], "circle"));
    createObject(new Object("circle", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new BoxCollider(false, undefined, undefined, undefined, undefined, undefined, true), new Transform(0,-5,2,2,0)], "circle"));
    createObject(new Object("circle", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new BoxCollider(false, undefined, undefined, undefined, undefined, undefined, true), new Transform(2,-8,2,2,0)], "circle"));
    createObject(new Object("circle", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new BoxCollider(false, undefined, undefined, undefined, undefined, undefined, true), new Transform(-2,-7,2,2,0)], "circle"));
    createObject(new Object("circle", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new BoxCollider(false, undefined, undefined, undefined, undefined, undefined, true), new Transform(-1,-10,2,2,0)], "circle"));
    createObject(new Object("circle", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new BoxCollider(false, undefined, undefined, undefined, undefined, undefined, true), new Transform(10,-9,10,10,0)], "circle"));   
    
    //player = createObject(new Object("player", [new ImageRenderer(SquareIMG, 16, false), new BoxCollider(false, .5,.5,0,0,0), new PlayerController(), new Ray(true,0, 0, undefined, 90), ], "Player"), 0, -2, 1, 1, 0);
    //player.GetComponent(BoxCollider).active = false;
    player = createObject(new Object("player", [new Ray(true,0, 0, undefined, 90), new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new PlayerController()], "Player"), 0, -2, .3, .3, 0);
    player.GetComponent(ImageRenderer).fillColor = "blue";
    
    circly = createObject(new Object("circlePointer", [new ImageRenderer("circle", 225, true, undefined, undefined, undefined, 1), new Transform(5,0,.3,.3,0)], "circle"));
    circly.GetComponent(ImageRenderer).fillColor = "red";
    circlyTransform = circly.GetComponent(Transform);

    camera = createObject(new Object("camera", [new Transform(0,0), new CameraController(.2, .5)], "camera"));
    gameLoopHasStarted = true;

    for(let i = 0; i < objectList.length; i++){
        objectList[i].Start();
    }
}
//car game scene
function LevelSetUp(playMode){
    gameLoopHasStarted = false;
    objectList = [];
    LevelLoader.levelList = [];
    for(let i = -10; i < 10; i++){
        for(let e = -10; e < 10; e++){
            createObject(new Object("road", [new ImageRenderer(AsphaltIMG, 900), new Transform(i*8,e*8,8,8,0)]));
        }
    }

    player = createObject(new Object("player", [new ImageRenderer(YellowCarIMG, 450), new PlayerController(), new CircleCollider(.5, .8, 0), new CircleCollider(.5, 0, 0), new CircleCollider(.5, -.8, 0)], "Player"), 0, -2, 2, 2, 90);

    if(!playMode){
        let mouseCursor = createObject(new Object("MouseCursor", [new ImageRenderer(ConcreteIMG, 377), new CursorFollower(), new Transform(-4,0,4,4,0)]));
        mouseCursor.GetComponent(ImageRenderer).renderInPost = true;
    }

    createObject(new Object("MPH Text", [new TextDisplay("0 MPH", canvas.width / 2 - 100, 650)]));
    createObject(new Object("Level Text", [new TextDisplay("Level 1", 10, 650)]));

    camera = createObject(new Object("camera", [new Transform(0,0), new CarCamera(.2, .2)], "camera"));

    gameLoopHasStarted = true;

    for(let i=0;i<objectList.length;i++){
        objectList[i].Start();
    }
}
//I put the camera last because the parenting out of sinc with objects
let camera = createObject(new Object("camera", [new Transform(0,0), new CameraController(.2, .5)], "camera"));

function MainMenu(){
    gameLoopHasStarted = false;
    objectList = [];
    LevelLoader.levelList = [];
    //Car Game text
    createObject(new Object("Title Text", [new TextDisplay("Car Game", canvas.width / 2 - 100, 240)]));
    //Play button text
    createObject(new Object("PlayButton", [new TextDisplay("Click to Play", canvas.width / 2 - 130, 300, 300, true, true, "black", "#FFF5BD", "#2F2820", "#FFBB6F"), new Button("LoadLevel1")]));

    camera = createObject(new Object("camera", [new Transform(0,0)], "camera"));
    camera.GetComponent(Transform).sx = -.5;
    gameLoopHasStarted = true;

    for(let i=0;i<objectList.length;i++){
        objectList[i].Start();
    }
}
function GameBeaten(){
    gameLoopHasStarted = false;
    objectList = [];
    LevelLoader.levelList = [];
    //Car Game text
    createObject(new Object("End Text", [new TextDisplay("You Win", canvas.width / 2 - 100, 240)]));

    camera = createObject(new Object("camera", [new Transform(0,0)], "camera"));
    camera.GetComponent(Transform).sx = -.5;
    gameLoopHasStarted = true;

    for(let i=0;i<objectList.length;i++){
        objectList[i].Start();
    }
}

function Spawn(){
    let playerTransform = player.GetComponent(Transform);
    createObject(new Object("square", [new ImageRenderer(SquareIMG, 8, true), new BoxCollider(false), new Transform(playerTransform.x,playerTransform.y,1,1,0)], "square"));
}


MainMenu();

//
addEventListener("keydown", Input.InputDown);
addEventListener("keyup", Input.InputUp);
canvas.addEventListener("wheel", Input.MouseWheel, {passive : false});
canvas.addEventListener("mousemove", Input.MouseMove);
canvas.addEventListener("mousedown", Input.MouseDown);
addEventListener("mouseup", Input.MouseUp);

//Call start function to every object within the level loading of it

gameLoopHasStarted = true;
GameLoop();
