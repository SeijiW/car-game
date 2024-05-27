let LoopsPerSec = 60
let objectList = []
let standardUnitSize = canvas.height / 5;
let gameLoopHasStarted = false;

let inDevMode = false;

function GameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    standardUnitSize = canvas.height / 5;
    Input.SetAxes();
    for(let i = 0; i < objectList.length; i++){
        objectList[i].EarlyUpdate();
    }
    for(let i = 0; i < objectList.length; i++){
        objectList[i].Update();
    }
    for(let i = 0; i < objectList.length; i++){
        objectList[i].LateUpdate();
    }
    //never try to access collision values during laterUpdate as it here where they are being reset.
    for(let i = 0; i < objectList.length; i++){
        objectList[i].LaterUpdate();
    }
    //collision detection
    circlyTransform.x = undefined;
    circlyTransform.y = undefined;
    for(let i = 0; i < objectList.length; i++){
        let boxC = objectList[i].GetComponent(BoxCollider)
        let rayC = objectList[i].GetComponent(Ray);
        //condition for a ray with limited range
        if(rayC != undefined && rayC.active && rayC.activelyCheck && rayC.length != "infinite"){
            for(let ii = 0; ii < objectList.length; ii++){
                //let boxC2 = objectList[ii].GetComponent(BoxCollider);
                let rayC2 = objectList[ii].GetComponent(Ray);
                //ray with ray
                if(rayC2 != undefined && rayC2.active){
                    let eq1 = ConvertToEquation(rayC.worldX, rayC.worldY, rayC.worldEndX, rayC.worldEndY);
                    let eq2 = ConvertToEquation(rayC2.worldX, rayC2.worldY, rayC2.worldEndX, rayC2.worldEndY);
                    let convergence = findLineConvergence(eq1, eq2);

                    let inEq1 = false;
                    let inEq2 = false;
                    
                    //checks x condition
                    if(rayC.worldX < rayC.worldEndX){
                        if(rayC.worldX <= convergence.x && convergence.x <= rayC.worldEndX){
                            inEq1 = true;
                        }
                    }
                    else if(rayC.worldEndX <= convergence.x && convergence.x <= rayC.worldX){
                        inEq1 = true;
                    }
                    if(rayC2.worldX < rayC2.worldEndX){
                        if(rayC2.worldX <= convergence.x && convergence.x <= rayC2.worldEndX){
                            inEq2 = true;
                        }
                    }
                    else if(rayC2.worldEndX <= convergence.x && convergence.x <= rayC2.worldX){
                        inEq2 = true;
                    }

                    if(inEq1 && inEq2){
                        rayC.colliding = true;
                        rayC2.colliding = true;
                        circlyTransform.x = convergence.x;
                        circlyTransform.y = convergence.y;
                    }
                }
            }
        }
        //condition for ray which length depends on location of intersection
        else if(rayC != undefined && rayC.active && rayC.activelyCheck && rayC.length == "infinite"){
            let convergenceList = [];
            for(let ii = 0; ii < objectList.length; ii++){
                //infinite ray with ray
                let rayC2 = objectList[ii].GetComponent(Ray);
                if(rayC2 != undefined && rayC2.active){
                    let eq1 = ConvertToEquation(rayC.worldX, rayC.worldY, rayC.worldEndX, rayC.worldEndY);
                    let eq2 = ConvertToEquation(rayC2.worldX, rayC2.worldY, rayC2.worldEndX, rayC2.worldEndY);
                    let convergence = findLineConvergence(eq1, eq2);

                    let inEq1 = false;
                    let inEq2 = false;
                    
                    if(rayC.worldX < rayC.worldEndX){
                        if(rayC.worldX <= convergence.x){
                            inEq1 = true;
                        }
                    }
                    else if(convergence.x <= rayC.worldX){
                        inEq1 = true;
                    }
                    if(rayC2.worldX < rayC2.worldEndX){
                        if(rayC2.worldX <= convergence.x && convergence.x <= rayC2.worldEndX){
                            inEq2 = true;
                        }
                    }
                    else if(rayC2.worldEndX <= convergence.x && convergence.x <= rayC2.worldX){
                        inEq2 = true;
                    }
                    let convergenceToPush = {
                        "x" : convergence.x,
                        "y" : convergence.y,
                        "collider" : rayC2
                    };
                    if(inEq1 && inEq2){
                        convergenceList.push(convergenceToPush);
                    }
                }
                let boxC2 = objectList[ii].GetComponent(BoxCollider);
                if(boxC2 != undefined && boxC2.active){
                    //infinite ray with box
                    if(!boxC2.isCircle){
                        let eqRay = ConvertToEquation(rayC.worldX, rayC.worldY, rayC.worldEndX, rayC.worldEndY);
                        let eqLeft = ConvertToEquation(boxC2.BL.x+.0001, boxC2.BL.y, boxC2.TL.x, boxC2.TL.y);
                        let eqTop = ConvertToEquation(boxC2.TL.x+.0001, boxC2.TL.y, boxC2.TR.x, boxC2.TR.y);
                        let eqRight = ConvertToEquation(boxC2.BR.x+.0001, boxC2.BR.y, boxC2.TR.x, boxC2.TR.y);
                        let eqBottom = ConvertToEquation(boxC2.BL.x+.0001, boxC2.BL.y, boxC2.BR.x, boxC2.BR.y);
                        let boxSides = [
                            {//left
                                "x1" : boxC2.BL.x+.0001,
                                "y1" : boxC2.BL.y,
                                "x2" : boxC2.TL.x,
                                "y2" : boxC2.TL.y
                            },
                            {//top
                                "x1" : boxC2.TL.x+.0001,
                                "y1" : boxC2.TL.y,
                                "x2" : boxC2.TR.x,
                                "y2" : boxC2.TR.y 
                            },
                            {//right
                                "x1" : boxC2.BR.x+.0001,
                                "y1" : boxC2.BR.y,
                                "x2" : boxC2.TR.x,
                                "y2" : boxC2.TR.y 
                            },
                            {//bottom
                                "x1" : boxC2.BL.x+.0001,
                                "y1" : boxC2.BL.y,
                                "x2" : boxC2.BR.x,
                                "y2" : boxC2.BR.y 
                            }       
                        ];
                        let boxEquationArray = [eqLeft, eqTop, eqRight, eqBottom];
    
                        for(let e = 0; e < boxEquationArray.length; e++){
                            let inEq1 = false;
                            let inEq2 = false;
                            let boxConvergence = findLineConvergence(eqRay, boxEquationArray[e]);
                            if(rayC.worldX < rayC.worldEndX){
                                if(rayC.worldX <= boxConvergence.x){
                                    inEq1 = true;
                                }
                            }
                            else if(boxConvergence.x <= rayC.worldX){
                                inEq1 = true;
                            }
                            if(boxSides[e].x1 < boxSides[e].x2){
                                if(boxSides[e].x1 <= boxConvergence.x && boxConvergence.x <= boxSides[e].x2){
                                    inEq2 = true;
                                }
                            }
                            else if(boxSides[e].x2 <= boxConvergence.x && boxConvergence.x <= boxSides[e].x1){
                                inEq2 = true;
                            }
                            if(inEq1 && inEq2){
                                let convergenceToPush = {
                                    "x" : boxConvergence.x,
                                    "y" : boxConvergence.y,
                                    "collider" : boxC2
                                };
                                convergenceList.push(convergenceToPush);
                            }
                        }
                    }
                    //infinite ray with circle
                    else if(boxC2.isCircle){
                        let eqRay = ConvertToEquation(rayC.worldX, rayC.worldY, rayC.worldEndX, rayC.worldEndY);
                        let circleConvergences = findCircleLineConvergence(boxC2.worldX, boxC2.worldY, boxC2.world_sx/2, eqRay);
                        for(let e = 0; e < circleConvergences.length; e++){
                            if((rayC.worldX < rayC.worldEndX && circleConvergences[e].x > rayC.worldX) || (rayC.worldX > rayC.worldEndX && circleConvergences[e].x < rayC.worldX)){
                                let convergenceToPush = {
                                    "x" : circleConvergences[e].x,
                                    "y" : circleConvergences[e].y,
                                    "collider" : boxC2
                                };
                                convergenceList.push(convergenceToPush);
                            }
                        }
                    }
                }
            }
            if(convergenceList.length >=1){
                smallest = convergenceList[0];
                if(rayC.worldX < rayC.worldEndX){
                    for(let ii = 0; ii < convergenceList.length; ii++){
                        if(convergenceList[ii].x < smallest.x)
                        smallest = convergenceList[ii];
                    }
                }
                else{
                    for(let ii = 0; ii < convergenceList.length; ii++){
                        if(convergenceList[ii].x > smallest.x)
                        smallest = convergenceList[ii];
                    }
                }
                rayC.colliding = true;
                rayC.worldEndX = smallest.x;
                rayC.worldEndY = smallest.y;
                smallest.collider.colliding = true;
                circlyTransform.x = smallest.x;
                circlyTransform.y = smallest.y;
            }
            else{

            }

        }
    }
    //
    for(let i = 0; i < objectList.length; i++){
        objectList[i].RenderUpdate();
    }
    for(let i = 0; i < objectList.length; i++){
        objectList[i].PostRenderUpdate();
    }
    for(let i = 0; i < Input.supportedKeys.length; i++){
        Input.supportedKeys[i].down = false;
        Input.supportedKeys[i].up = false;
        Input.mouseJustDown = false;
    }
    setTimeout(GameLoop, 1000/LoopsPerSec);
}
function createObject(object, x, y, sx, sy, r){
    objectList.push(object);
    object.order = objectList.length-1;
    let objectTransform = object.GetComponent(Transform)
    if(objectTransform == undefined){
        objectTransform = new Transform(x, y, sx, sy, r)
        object.AddComponent(objectTransform, true)
    }
    if(gameLoopHasStarted){
        object.Start();
    }
    return object
}
function destroy(object){
    objectList.splice(object.order, 1);
    for(let i = 0; i < objectList.length; i++){
        objectList[i].order = i;
    }
    return object
}
function degToRad(degs){
    return degs*Math.PI/180
}
function distance(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}
function RoundToHundreds(number){
    return Math.round(number*100)/100
}
//if number is positive it will add. If number is negative it will subtract. Will do nothing if number is 0. Will not allow operation to result in a sign change.
function AddAwayFromZero(number, amountToAdd){
    if(number == 0){
        return 0;
    }
    else if(number > 0){
        if(number + amountToAdd < 0){
            return 0;
        }
        else return number + amountToAdd;
    }
    else{
        if(number - amountToAdd > 0){
            return 0;
        }
        else return number - amountToAdd;
    }
}

function ScreenToWorldPoint(x, y){
    let result = {
        "x" : camera.GetComponent(Transform).x + ((-(canvas.width / 2) + x) / camera.GetComponent(Transform).sx) / standardUnitSize,
        "y" : camera.GetComponent(Transform).y + ((-(canvas.height / 2) + y) / camera.GetComponent(Transform).sx / standardUnitSize)
    }
    return{
        "x": result.x,
        "y": result.y
    };
}