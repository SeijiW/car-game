let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

relativePath = "https://seijiw.github.io/car-game/GamePage/";
//image loading
let ColorIMG = new Image(225, 225);
ColorIMG.src = relativePath + "Images/color.png";

let SquareIMG = new Image(8, 8);
SquareIMG.src = relativePath + "Images/Square.png";

let GridPieceIMG = new Image(88, 88);
GridPieceIMG.src = relativePath + "Images/gridPiece.png";

let YellowCarIMG = new Image(720, 360);
YellowCarIMG.src = relativePath + "Images/YellowCar.png";

let ConcreteIMG = new Image(377, 377);
ConcreteIMG.src = relativePath + "Images/Concrete.png";

let AsphaltIMG = new Image(900, 900);
AsphaltIMG.src = relativePath + "Images/Asphalt.png";

let FinishIMG = new Image(377, 377);
FinishIMG.src = relativePath + "Images/Finish.png";

//audio
let carEngineSound = new Audio("Audio/carAcceleration.mp3"); //play for 450 ms
let tireSkidSound = new Audio("Audio/TireSkid.mp3") //126 ms
let crashSound = new Audio("Audio/Crash.mp3")
